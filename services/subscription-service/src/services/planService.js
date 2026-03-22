const fs = require('fs');
const path = require('path');
const planRepo = require('../repositories/planRepository.js');

/**
 * @class PlanService
 * @description Handles complex business logic for subscription plans, including 
 * feature parsing, file system operations for JSON configs, and versioning.
 */
class PlanService {
    /**
     * Creates a new subscription plan along with its associated policy and features.
     * Handles complex logic for features: 
     * - If 1 feature: Saves directly to the database.
     * - If >1 feature: Saves as a JSON file and stores the file path in the database.
     * 
     * @param {Object} data - The payload containing plan, policy, and feature details.
     * @returns {Promise<Object>} The newly created subscription plan.
     * @throws {Error} If database insertion or file system operations fail.
     */
    async createPlan(data) {
        // Extract features from payload, supporting different naming conventions
        const features = data.features_json || data.feature_list || [];
        
        // ==========================================
        // 1. Create Policy (Resource limitations)
        // ==========================================
        const policyData = {
            max_days: data.max_days || 0,
            max_users: data.max_users || 0,
            max_storage: data.max_storage || 0,
            max_courses: data.max_courses || 0,
            ai_tokens: data.ai_tokens || 0
        };
        const policy = await planRepo.createPolicy(policyData);

        let featureId = null;

        // ==========================================
        // 2. Handle Features Logic
        // ==========================================
        if (features.length === 1) {
            // Scenario A: Only one feature provided. 
            // Store it directly as a single record in the Feature table.
            const singleFeature = features[0];
            const feature = await planRepo.createFeature({
                name: singleFeature.name || singleFeature.feature_name,
                feature_key: singleFeature.feature_key,
                description: singleFeature.description || '',
                value_type: singleFeature.value_type || 'boolean',
                // Ensure the value is cast to a string for DB consistency
                feature_value: singleFeature.feature_value ? singleFeature.feature_value.toString() : ''
            });
            featureId = feature.id;

        } else if (features.length > 1) {
            // Scenario B: Multiple features provided.
            // Write them to a physical JSON file to avoid bloating the DB, 
            // then store the file path as the 'feature_value'.
            
            // Define the directory path for storing feature configuration files
            const configDir = path.join(__dirname, '../config/json_config');
            
            // Ensure the directory exists; create it if it doesn't
            if (!fs.existsSync(configDir)) {
                fs.mkdirSync(configDir, { recursive: true });
            }
            
            // Generate a safe file name based on the plan's name (alphanumeric and underscores only)
            const safePlanName = (data.name || 'plan').toLowerCase().replace(/[^a-z0-9]/g, '_');
            const fileName = `${safePlanName}.json`;
            const filePath = path.join(configDir, fileName);
            // Relative path to be saved in the database
            const dbFilePath = `/config/json_config/${fileName}`;

            // Synchronously write the features array to the JSON file
            fs.writeFileSync(filePath, JSON.stringify(features, null, 2), 'utf-8');

            try {
                // Create a "wrapper" feature record in the DB pointing to the JSON file
                const feature = await planRepo.createFeature({
                    name: `${data.name}`,
                    // Use the plan name as the key, uppercase
                    feature_key: `${safePlanName.toUpperCase()}`, 
                    // Store the total number of features in the description field
                    description: `${features.length}`,
                    // Explicitly mark this record as a file path reference
                    value_type: 'json_path', 
                    // Store the relative path to the newly created JSON file
                    feature_value: dbFilePath 
                });
                
                featureId = feature.id;

            } catch (err) {
                // Log and re-throw the error to be caught by the Controller/ErrorHandler
                console.error( err.message);
                throw err; 
            }
        }

        // ==========================================
        // 3. Create the Main Subscription Plan
        // ==========================================
        // Assemble the final payload, linking the newly created Policy ID and Feature ID
        const planData = {
            name: data.name,
            user_type: data.user_type || 'b2b',
            payment_term: 'monthly', // Defaulting to monthly as per current business rules
            price: data.price_monthly || 0,
            currency: data.currency || 'VND',
            // Link the feature ID (can be null if no features were provided)
            feature_id: featureId,
            // Link the mandatory policy ID
            subscription_policy_id: policy.id,
            current_version: data.version || '1.0',
            // Use provided status, default to active (1) if undefined
            status: data.status !== undefined ? parseInt(data.status) : 1
        };

        // Persist the main plan record to the database and return it
        return await planRepo.createPlan(planData);
    }

    /**
     * Update a plan using a Versioning approach (Immutable Data).
     * Deactivates the old plan, bumps the version by 0.1, and creates a new record.
     * @param {number|string} oldPlanId - ID of the plan to be updated.
     * @param {Object} newData - The new data payload.
     * @returns {Promise<Object>} The newly created (updated) subscription plan object.
     */
    async updatePlan(oldPlanId, newData) {
        const oldPlan = await planRepo.getPlanById(oldPlanId);
        if (!oldPlan) throw new Error("plan.old_plan_not_found");

        const oldVersion = parseFloat(oldPlan.current_version) || 1.0;
        const newVersion = (oldVersion + 0.1).toFixed(1);

        // Deactivate the existing plan instead of overwriting it
        await planRepo.deactivatePlan(oldPlanId);

        // Create the new plan with bumped version
        newData.version = newVersion.toString();
        const newPlan = await this.createPlan(newData);

        // Link the new plan to its predecessor
        await planRepo.updatePreviousVersion(newPlan.id, oldPlan.current_version);
        
        return newPlan;
    }

    /**
     * Deactivate sub plan 
     */

    async deactivatePlan(id){
        const plan = await planRepo.getPlanById(id);
        if(!plan){
            // Cannot find plan
            throw new Error('plan.not_found');
        }
        await planRepo.updatePlan(id, {status : 0});
        return true;
    }


    /**
     * Delete plan
     */
    async deletePlan(id){
        const plan = await planRepo.getPlanById(id);
        if(!plan){
            // cannot find plan
            throw new Error('plan.not_found');
        }
        try{
            // Find success, delete it
            await planRepo.deletePlan(id);
            return true;
        }
        catch(error){
            if (error.name === 'SequelizeForeignKeyConstraintError'){
                throw new Error('plan.delete_constraint_errror')
            }
            throw error;
        }
    }



    /**
     * Retrieve all subscription plans for the frontend.
     * @returns {Promise<Array>} List of subscription plans.
     */
    async getAllPlans() {
        const plans = await planRepo.getAllPlans();

        return plans.map(p => {
            //convert plan to json 
            const plan = p.toJSON();

            //fotmat infor 
            const formattedPlan = {
                id: plan.id,
                name: plan.name,
                user_type: plan.user_type,
                currency: plan.currency,
                price: parseFloat(plan.price) || 0,
                price_annual: (parseFloat(plan.price) || 0) * 12,
                current_version: plan.current_version,
                status: plan.status ? 1 : 0,
                
                // Columns from  policy table
                max_days: plan.policy ? plan.policy.max_days : 0,
                max_users: plan.policy ? plan.policy.max_users : 0,
                max_courses: plan.policy ? plan.policy.max_courses : 0,
                max_storage: plan.policy ? plan.policy.max_storage : 0,
                ai_tokens: plan.policy ? plan.policy.ai_tokens : 0,
            };
            //Handle features and read json file
            let finalFeatures = [];
            
            if (plan.feature) {
                // Case 1:if feature is a json file that contains multiple 
                if (plan.feature.value_type === 'json_path') {
                    try {
                        // Concat path to json file
                        const filePath = path.join(__dirname, '..', plan.feature.feature_value);
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        finalFeatures = JSON.parse(fileContent);
                    } catch (error) {
                        console.error(error.message);
                        finalFeatures = [];
                    }
                } 
                // Case 2 : Just one feature , store directly to DB
                else {
                    finalFeatures = [{
                        name: plan.feature.name || plan.feature.feature_name || "",
                        feature_key: plan.feature.feature_key,
                        description: plan.feature.description,
                        value_type: plan.feature.value_type,
                        feature_value: plan.feature.feature_value
                    }];
                }
            }

            formattedPlan.features_json = finalFeatures;
            
            return formattedPlan;
        })
    }

    /**
     * Retrieve a specific plan by its ID.
     * @param {number|string} planId - ID of the plan to retrieve.
     * @returns {Promise<Object>} The subscription plan.
     */
    async getPlanById(planId) {
        return await planRepo.getPlanById(planId);
    }
}

module.exports = new PlanService();