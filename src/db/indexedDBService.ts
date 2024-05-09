
interface WorkflowFolder {
  id?: number;
  folderName: string;
  flowData: any;
  flowNodes: any[];
}

if (!("indexedDB" in window)) {
  alert("IndexedDB is not supported in this browser.");
}

const request = window.indexedDB.open("WorkflowDatabase", 1);

// database schema
request.onupgradeneeded = (event) => {
  const db = (event.target as IDBOpenDBRequest).result;
  db.createObjectStore("workflowFolders", { keyPath: "id", autoIncrement: true });
};

// functon to add a new workflow folder
export const addWorkflowFolder = (folderName: string, flowData: any, flowNodes: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["workflowFolders"], "readwrite");
      const objectStore = transaction.objectStore("workflowFolders");
      const request = objectStore.add({ folderName, flowData, flowNodes });

      request.onsuccess = (event) => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
  });
}

// function to retrieve all workflow folders
export const getAllWorkflowFolders = (): Promise<WorkflowFolder[]> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["workflowFolders"], "readonly");
      const objectStore = transaction.objectStore("workflowFolders");
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        resolve((event.target as IDBRequest).result);
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
  });
}

// function to remove a workflow folder by ID
export const removeWorkflowFolder = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["workflowFolders"], "readwrite");
      const objectStore = transaction.objectStore("workflowFolders");
      const request = objectStore.delete(id);

      request.onsuccess = (event) => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
  });
}

// function to update a workflow folder by ID
export const updateWorkflowFolder = (id: number, folderName: string, flowData: any, flowNodes: any[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(["workflowFolders"], "readwrite");
      const objectStore = transaction.objectStore("workflowFolders");
      const request = objectStore.put({ id, folderName, flowData, flowNodes });

      request.onsuccess = (event) => {
        resolve();
      };

      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
  });
}
