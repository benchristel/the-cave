# The Cave: A Task Explorer

Programming is hard. One of the hard things about it is keeping track of all the context and dependent tasks associated with getting something done. It's not uncommon for me to say or think something like "We need to investigate X as an alternative to Y so that we can write a more robust test for Z, which we need to do in order to write the API in support of feature Foo, and now that I think about it, Foo is a terrible name for this and it should really be called Bar but I want to rename it in a separate commit because it will touch a lot of files and this diff is already huge. I would have committed half an hour ago except the outstanding changes are a good reminder of which pieces we need to revist. Is it time for a ping-pong break yet?" Needless to say, keeping all of this context in a human brain is a great way to lose track of a lot of it. I've used sticky notes and todo comments as a patch, but neither of these strategies is very good at helping you find your way out of deep rabbit-holes.

There are basically two subproblems here: you want to keep track of a todo list and check off items one at a time, but in the course of doing an item you may discover a subproblem that needs its own todo list. A todo list is basically a queue, but when you have subproblems nested within each task, you need a stack to keep track of the nesting. A hybrid data structure is called for.

The Cave is a tool that visually represents a dependency tree of tasks, so you don't have to keep it all in your head. The tree supports both stack-like and queue-like operations

The current task has green text.

In addition to the tree's structure, there is an indicator of which task you're working on right now, as well as an indication of which tasks are already done.

There are five basic actions to manipulate the tree: **Now**, **Later**, **Finish**, **Defer**, and **Skip**.

* **Now**: Your current task is blocked by a subproblem. You need to solve that subproblem now. This adds a child to the current task node and makes the child node the new current task. This is basically like pushing a stack frame.
* **Later**: You need to do something else once your current task is out of the way. Often this is refactoring or some other type of cleanup. This adds a sibling of the current task node, essentially enqueueing a todo item.
* **Finish**: This marks the current task as completed. If the task node has siblings that have not been completed, the next sibling becomes the current task. Otherwise, the parent node becomes the current task.
* **Defer**: Sometimes you realize that you don't yet have everything you need to solve a particular problem, but you can keep going with other work in the meantime. Maybe you need to confer with teammates about an API design, or revisit how authentication will affect a particular feature. When that happens, you can defer your current task by pushing it up to become a sibling of its parent.
* **Skip** lets you get to the next item on your todo list. This is good for when you add **Later** reminders in one order, but want to complete them in a different order.
