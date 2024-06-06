if (typeof vm === 'undefined') {
    vm = document.getElementById('app')._reactRootContainer._internalRoot.current.child.pendingProps.store.getState().scratchGui.vm;
}

vm.stage = null

vm.runtime.Clones = {
    vm: vm,
    _maxClones: 300,
    clones: [],
    runtime: vm.runtime,
    targets: vm.runtime.targets,
    OriginalTargets: [],
};

vm.runtime.Clones.SetMaxClones = function(amount) {
    vm.runtime._events.SET_MAX_CLONES(amount);
};

vm.runtime.clonesAvailable = function() {
    return vm.runtime._cloneCounter < vm.runtime.Clones._maxClones;
};

function UpdateClonesArray() {
    vm.runtime.Clones.clones = [];
    vm.runtime.Clones.OriginalTargets = [];
    for (var i = 0; i < vm.runtime.targets.length; i++) {
        var target = vm.runtime.targets[i];
        if (!target.isOriginal) {
            vm.runtime.Clones.clones.push(target);
            vm.AllClones = vm.Clones.clones;
        } else {
            vm.runtime.Clones.OriginalTargets.push(target);
        }
    }

    for (var Item in vm.runtime.targets) {
        if (vm.runtime.targets[Item].setMaxListeners) {
            vm.runtime.targets[Item].setMaxListeners(Infinity);
        }
    }

    if (vm.runtime.Clones.clones.length > vm.runtime.Clones._maxClones) {
        vm.runtime.Clones.clones.length = vm.runtime.Clones._maxClones;
    }
}

vm.Clones = vm.runtime.Clones;
vm.clones = vm.Clones;
vm.CLONES = vm.Clones;

vm.runtime.SetMaxClones = (amount) => {
    vm.clones.SetMaxClones(amount);
}

setInterval(UpdateClonesArray, 4);

vm.runtime.Cloud = {
    Provider: null,
    HasCloudData: null,
    Connection: null,
    Functions: {
        updateCloudVariable: arg => vm.runtime.ioDevices.cloud.updateCloudVariable(arg),
        requestCreateVariable: arg => vm.runtime.ioDevices.cloud.requestCreateVariable(arg),
        requestUpdateVariable: arg => vm.runtime.ioDevices.cloud.requestUpdateVariable(arg),
        postData: arg => vm.runtime.ioDevices.cloud.postData(arg),
        requestRenameVariable: arg => vm.runtime.ioDevices.cloud.requestRenameVariable(arg),
        requestDeleteVariable: arg => vm.runtime.ioDevices.cloud.requestDeleteVariable(arg)
    }
};

let LoadEvents = () => {
    vm.runtime._events['STAGE_CHANGED'] = function() {};
    vm.runtime._events['SET_STAGE'] = function(e) {
        vm.stage = vm.runtime.getTargetById(e);
        vm.stage.variables = vm.runtime.getTargetForStage().variables;
        vm.runtime.getTargetForStage().variables = {};
        vm.runtime.getTargetForStage().isStage = false;
        vm.stage.isStage = true;
        vm.emit('STAGE_CHANGED')
    };

    vm.SetStage = function(e) {
        vm.runtime._events.SET_STAGE(e);
    };

    vm._events['VM_DISPOSE'] = function() {
        function DisposeOfVM(vm) {
            vm = null;
            document.getElementById('app')._reactRootContainer._internalRoot.current.child.pendingProps.store.getState().scratchGui.vm = null;
        }
        setInterval(DisposeOfVM, 0, vm);
    };
    vm.runtime._events['SET_MAX_CLONES'] = function(amount) {
        vm.setMaxListeners(Infinity);
        vm.runtime.Clones._maxClones = amount;
    };
};

LoadEvents();

vm.SetStage(vm.runtime.targets[0].id)

LoadEvents = null;
