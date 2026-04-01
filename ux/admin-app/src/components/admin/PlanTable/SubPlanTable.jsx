import React, { useState } from "react";

const PlanTable = () => {
  // 1. DỮ LIỆU MẪU (Mock Data)
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Basic Plan",
      price: "100,000",
      currency: "VND",
      duration: "Month",
      status: true,
    },
    {
      id: 2,
      name: "Pro Plan",
      price: "1,000,000",
      currency: "VND",
      duration: "Year",
      status: true,
    },
    {
      id: 3,
      name: "Enterprise",
      price: "500",
      currency: "USD",
      duration: "Year",
      status: false,
    },
    {
      id: 4,
      name: "Student Plan",
      price: "50,000",
      currency: "VND",
      duration: "Month",
      status: true,
    },
    {
      id: 5,
      name: "Teacher Pro",
      price: "200,000",
      currency: "VND",
      duration: "Year",
      status: true,
    },
    {
      id: 6,
      name: "B2B Standard",
      price: "2,000,000",
      currency: "VND",
      duration: "Year",
      status: false,
    },
  ]);

  // State để quản lý việc mở Dropdown (Action menu) cho từng hàng
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex flex-col gap-2 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Subscription Plans
          </h3>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form>
            <div className="relative">
              <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                <svg
                  className="fill-gray-500 dark:fill-gray-400"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
                    fill=""
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search..."
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pr-4 pl-[42px] text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[300px] dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="custom-scrollbar max-w-full overflow-x-auto overflow-y-visible px-5 sm:px-6">
        <table className="min-w-full">
          <thead className="border-y border-gray-100 py-3 dark:border-gray-800">
            <tr>
              <th className="py-3 pr-5 font-normal whitespace-nowrap sm:pr-6 text-left">
                <div className="flex items-center">
                  <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    Name
                  </p>
                </div>
              </th>
              <th className="px-5 py-3 font-normal whitespace-nowrap sm:px-6 text-left">
                <div className="flex items-center">
                  <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    Price
                  </p>
                </div>
              </th>
              <th className="px-5 py-3 font-normal whitespace-nowrap sm:px-6 text-left">
                <div className="flex items-center">
                  <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    Currency
                  </p>
                </div>
              </th>
              <th className="px-5 py-3 font-normal whitespace-nowrap sm:px-6 text-left">
                <div className="flex items-center">
                  <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    Duration
                  </p>
                </div>
              </th>
              <th className="px-5 py-3 font-normal whitespace-nowrap sm:px-6 text-left">
                <div className="flex items-center">
                  <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    Status
                  </p>
                </div>
              </th>
              <th className="px-5 py-3 font-normal whitespace-nowrap sm:px-6 text-center">
                <div className="flex items-center justify-center">
                  <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    Action
                  </p>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {plans.map((plan) => (
              <tr key={plan.id}>
                <td className="py-3 pr-5 whitespace-nowrap sm:pr-5">
                  <div className="flex items-center">
                    <span className="text-theme-sm block font-black text-gray-700 dark:text-gray-400">
                      {plan.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap sm:px-6">
                  <div className="flex items-center">
                    <p className="text-theme-sm text-gray-700 dark:text-gray-400">
                      {plan.price}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap sm:px-6">
                  <div className="flex items-center">
                    <p className="text-theme-sm text-gray-700 dark:text-gray-400">
                      {plan.currency}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap sm:px-6">
                  <div className="flex items-center">
                    <p className="text-theme-sm text-gray-700 dark:text-gray-400">
                      {plan.duration}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap sm:px-6">
                  <div className="flex items-center">
                    <p
                      className={`text-theme-xs rounded-full px-2 py-0.5 font-medium ${
                        plan.status
                          ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500"
                          : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-500"
                      }`}
                    >
                      {plan.status ? "Active" : "Deactive"}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3 whitespace-nowrap sm:px-6">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(plan.id)}
                        className="text-gray-500 dark:text-gray-400 cursor-pointer"
                      >
                        <svg
                          className="fill-current"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z"
                            fill=""
                          />
                        </svg>
                      </button>
                      {openDropdownId === plan.id && (
                        <div className="shadow-theme-lg dark:bg-gray-dark absolute right-0 z-10 w-40 space-y-1 rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800">
                          <button className="text-theme-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 cursor-pointer">
                            Edit
                          </button>
                          <button className="text-theme-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 cursor-pointer">
                            Show details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <button className="text-theme-sm shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:px-3.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.58301 9.99868C2.58272 10.1909 2.65588 10.3833 2.80249 10.53L7.79915 15.5301C8.09194 15.8231 8.56682 15.8233 8.85981 15.5305C9.15281 15.2377 9.15297 14.7629 8.86018 14.4699L5.14009 10.7472L16.6675 10.7472C17.0817 10.7472 17.4175 10.4114 17.4175 9.99715C17.4175 9.58294 17.0817 9.24715 16.6675 9.24715L5.14554 9.24715L8.86017 5.53016C9.15297 5.23717 9.15282 4.7623 8.85983 4.4695C8.56684 4.1767 8.09197 4.17685 7.79917 4.46984L2.84167 9.43049C2.68321 9.568 2.58301 9.77087 2.58301 9.99715C2.58301 9.99766 2.58301 9.99817 2.58301 9.99868Z"
                fill=""
              />
            </svg>
            <span className="hidden sm:inline"> Previous </span>
          </button>

          <span className="block text-sm font-medium text-gray-700 sm:hidden dark:text-gray-400">
            Page 1 of 10
          </span>

          <ul className="hidden items-center gap-0.5 sm:flex">
            <li>
              <a
                href="#"
                className="bg-brand-500/[0.08] text-theme-sm text-brand-500 hover:bg-brand-500/[0.08] hover:text-brand-500 dark:text-brand-500 dark:hover:text-brand-500 flex h-10 w-10 items-center justify-center rounded-lg font-medium"
              >
                1
              </a>
            </li>
          </ul>

          <button className="text-theme-sm shadow-theme-xs flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-2 py-2 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 sm:px-3.5 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            <span className="hidden sm:inline"> Next </span>
            <svg
              className="fill-current"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z"
                fill=""
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanTable;
