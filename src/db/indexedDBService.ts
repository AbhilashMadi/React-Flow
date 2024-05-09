import Dexie from "dexie";
import { WorkflowFolder as Workflow } from "@/types/storage-schemas";

class WorkflowsDatabase extends Dexie {
  workflows: Dexie.Table<Workflow, number>;

  constructor() {
    super("workflows-db");
    this.version(1).stores({
      workflows: "++id,folderName,flowData,flowNodes"
    });
    this.workflows = this.table("workflows");
  }
}

// Initialize the database
const db = new WorkflowsDatabase();

// Function to get all workflows
export const getWorkflows = async (): Promise<Workflow[]> => {
  try {
    return await db.workflows.toArray();
  } catch (error) {
    console.error("Error fetching workflows:", error);
    throw error;
  }
}

// Function to get a workflow by ID
export const getWorkflow = async (id: number): Promise<Workflow | undefined> => {
  try {
    return await db.workflows.get(id);
  } catch (error) {
    console.error("Error fetching workflow:", error);
    throw error;
  }
}

// Function to update a workflow
export const updateWorkflow = async (id: number, updatedWorkflow: Workflow): Promise<void> => {
  try {
    await db.workflows.update(id, updatedWorkflow);
  } catch (error) {
    console.error("Error updating workflow:", error);
    throw error;
  }
}

// Function to remove a workflow by ID
export const removeWorkflow = async (id: number): Promise<void> => {
  try {
    await db.workflows.delete(id);
  } catch (error) {
    console.error("Error removing workflow:", error);
    throw error;
  }
}

// Function to clear all workflows
export const clearWorkflows = async (): Promise<void> => {
  try {
    await db.workflows.clear();
  } catch (error) {
    console.error("Error clearing workflows:", error);
    throw error;
  }
}

// Function to store a new workflow
export const storeNewWorkflow = async (newWorkflow: Workflow): Promise<number> => {
  try {
    return await db.workflows.add(newWorkflow);
  } catch (error) {
    console.error("Error storing new workflow:", error);
    throw error;
  }
}
