"use strict"

function Problem() {
    var self =
        { addDependency: addDependency
        , addSibling: addSibling
        , finishCurrentTask: finishCurrentTask
        , deferCurrentTask: deferCurrentTask
        , skipCurrentTask: skipCurrentTask
        , undo: undo
        , rootTask: rootTask
        }

    var rootTask = Task('(root)')
    var transformations = Transformations()

    function rootTask() {
        return transformations.apply(Task('(root)'))
    }

    function addDependency(description) {
        transformations.push(AddDependencyTransformation(description))
    }

    function addSibling(description) {
        transformations.push(AddSiblingTransformation(description))
    }

    function finishCurrentTask() {
        transformations.push(FinishTransformation())
    }

    function deferCurrentTask() {
        transformations.push(DeferTransformation())
    }

    function skipCurrentTask() {
        transformations.push(SkipTransformation())
    }

    function undo() {
        transformations.pop()
    }

    // private //

    function makeCurrent(task) {
        if (currentTask) currentTask.current = false
        task.current = true
        currentTask = task
    }

    return self
}


function Transformations() {
    var list = []

    return {
        apply: apply,
        push: push,
        pop: pop
    }

    function apply(treeRoot) {
        var currentState = CurrentTaskController(treeRoot)

        list.forEach(function(transformation) {
            transformation.apply(currentState)
        })

        return treeRoot
    }

    function push(transformation) {
        return list.push(transformation)
    }

    function pop(transformation) {
        return list.pop(transformation)
    }
}

function AddDependencyTransformation(description) {
    return { apply: apply }

    function apply(state) {
        var newTask = Task(description)
        state.currentTask.dependOn(newTask)
        state.makeCurrent(newTask)
    }
}

function AddSiblingTransformation(description) {
    return { apply: apply }

    function apply(state) {
        var newTask = Task(description)

        if (state.currentTask.dependent) {
            state.currentTask.dependent.dependOn(newTask)
        } else {
            state.currentTask.dependOn(newTask)
        }
    }
}

function FinishTransformation() {
    return { apply: apply }

    function apply(state) {
        if (!state.currentTask.dependent) return

        state.currentTask.finished = true

        var nextSibling = state.currentTask.next()

        if (nextSibling != state.currentTask) {
            state.makeCurrent(nextSibling)
        } else {
            state.makeCurrent(state.currentTask.dependent)
        }
    }
}

function DeferTransformation() {
    return { apply: apply }

    function apply(state) {
        var nextSibling = state.currentTask.next()

        var parent = state.currentTask.dependent
        if (parent && parent.dependent) {
            parent.dependent.dependOn(state.currentTask)
        }

        if (nextSibling && nextSibling != state.currentTask) {
            state.makeCurrent(nextSibling)
        } else {
            state.makeCurrent(parent)
        }
    }
}

function SkipTransformation() {
    return { apply: apply }

    function apply(state) {
        state.makeCurrent(state.currentTask.next())
    }
}

function CurrentTaskController(initialCurrentState) {
    var self = {
        makeCurrent: function(task) {
            if (self.currentTask) self.currentTask.current = false
            task.current = true
            self.currentTask = task
        },
        currentTask: initialCurrentState
    }

    return self
}
