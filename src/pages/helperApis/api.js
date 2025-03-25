import { useCallback } from "react";
import { companyApi, branchApi } from "./../../core/core-index";

export const useCompanyListData = (getApi) => {
  return useCallback(async () => {
    try {
      const response = await getApi(`${companyApi.Get}`);

      if (response?.status === 200 && response?.data?.isSuccess) {
        const { companies } = response.data.payload;

        const formattedCompanies = companies.map((company) => ({
          key: company.name, 
          value: company.id, 
        }));

        return formattedCompanies;
      } else {
        console.error("Failed to fetch company data:", response?.data?.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching company data:", error.message);
      return [];
    }
  }, [getApi]);
};
export const useBranchListData = (getApi) => {
  return useCallback(async () => {
    try {
      const response = await getApi(`${branchApi.Get}`);

      if (response?.status === 200 && response?.data?.isSuccess) {
        const { branches } = response.data.payload;
        const formattedBranches = branches.map((branch) => ({
          key: `${branch.code}-${branch.name}`, 
          value: branch.id, 
        }));

        return formattedBranches;
      } else {
        console.error("Failed to fetch branch data:", response?.data?.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching branch data:", error.message);
      return [];
    }
  }, [getApi]);
};
