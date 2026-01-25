import { create } from "zustand";
import { ArduinoVM } from "@/arduino/arduino-vm";

interface ArduinoVMStore {
  instances: Map<string, ArduinoVM>;
  
  // Get or create VM instance for a node
  getVM: (nodeId: string, onPinUpdate: (handleId: string, mode: "INPUT" | "OUTPUT", value: 0 | 1) => void) => ArduinoVM;
  
  // Remove VM instance
  removeVM: (nodeId: string) => void;
  
  // Stop all VMs
  stopAll: () => void;
}

export const useArduinoVMStore = create<ArduinoVMStore>((set, get) => ({
  instances: new Map(),
  
  getVM: (nodeId, onPinUpdate) => {
    const { instances } = get();
    
    let vm = instances.get(nodeId);
    if (!vm) {
      vm = new ArduinoVM({
        onStateChange: (state) => {
          // Could sync to circuit store here if needed
        },
        onPinUpdate,
      });
      
      const newInstances = new Map(instances);
      newInstances.set(nodeId, vm);
      set({ instances: newInstances });
    }
    
    return vm;
  },
  
  removeVM: (nodeId) => {
    const { instances } = get();
    const vm = instances.get(nodeId);
    
    if (vm) {
      vm.stop();
      const newInstances = new Map(instances);
      newInstances.delete(nodeId);
      set({ instances: newInstances });
    }
  },
  
  stopAll: () => {
    const { instances } = get();
    instances.forEach((vm) => vm.stop());
    set({ instances: new Map() });
  },
}));
