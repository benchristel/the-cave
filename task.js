function remove(item, array) {
  var index = array.indexOf(item)
  if (index === -1) return
  array.splice(index, 1)
}

function Task(description) {
  var dependencies = []

  var self =
    { description: description
    , dependencies: dependencies
    , dependent: null
    , dependOn: dependOn
    , next: next
    , root: root
    , actionableDescendents: actionableDescendents
    , html: html
    }

  function dependOn(other) {
    dependencies.push(other)
    if (other.dependent) {
      remove(other, other.dependent.dependencies)
    }
    other.dependent = self
  }

  function next() {
    var sibs = self.dependent.dependencies
    var myIndex = sibs.indexOf(self)
    var i = myIndex
    do {
        i = (i + 1) % sibs.length
    } while (sibs[i].finished && i != myIndex)
    return sibs[i]
  }

  function root() {
    return self.dependent ? self.dependent.root() : self
  }

  function actionableDescendents() {
    if (self.dependencies.every(isFinished)) return [self]
    return self.dependencies.map(function (t) {
        return t.actionableDescendents()
    }).reduce(function(a, b) {
        return a.concat(b)
    })
  }

  function html(depth) {
    if (!depth) depth = 1

    var depthClass = depth % 2 ? 'odd-depth' : 'even-depth'
    var dependenciesAsHtml = dependencies.map(function(d) {
      return d.html(depth + 1)
    }).join('')

    var currentClass = self.current ? ' current' : ''
    var finishedClass = self.finished ? ' finished' : ''
    var renderedDescription = self.finished ? '^_^' : description

    return '<div class="task '+depthClass+currentClass+finishedClass+'"><div class="description">' +
      renderedDescription +
      '</div><div class="dependencies">'+
      dependenciesAsHtml +
      '</div></div>'
  }

  // private //

  function isFinished(task) {
    return task.finished
  }

  return self
}
