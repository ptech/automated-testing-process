import { DataTable } from "@cucumber/cucumber";

/**
 * Test Helper Utilities
 *
 * Collection of utility functions and helper methods to support test automation.
 * This class provides common functionality that can be reused across different
 * test scenarios and page objects.
 *
 */
export class TestHelpers
{ 
    /**
     * Convert DataTable to flat array of strings
     * @param dataTable - Cucumber DataTable
     * @returns Array of strings
     */
    static extractDataTableValues ( dataTable: DataTable ): string[]
    {
        return dataTable.rows().flat();
    }
}
