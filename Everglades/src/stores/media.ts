import { defineStore } from "pinia";

interface Resource {
  id: number;
  modelYear: string;
  boatModel: string;
  type: string; // "Images", "Videos", etc.
  url: string;
}

export const useMediaStore = defineStore("media", {
  state: () => ({
    resources: [] as Resource[], // All resources
    filteredResources: [] as Resource[] // Filtered resources
  }),

  actions: {
    // Set the initial resource list
    setResources(resources: Resource[]) {
      this.resources = resources;
      this.filteredResources = resources; // Initialize filtered list
    },

    // Filter resources based on selected filters
    filterResources(filters: { modelYear: string | null; boatModel: string | null; resourceType: string | null }) {
      this.filteredResources = this.resources.filter((resource) => {
        return (
          (!filters.modelYear || resource.modelYear === filters.modelYear) &&
          (!filters.boatModel || resource.boatModel === filters.boatModel) &&
          (!filters.resourceType || resource.type === filters.resourceType)
        );
      });
    }
  }
});
