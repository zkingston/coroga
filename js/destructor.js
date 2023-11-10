function DestructorEngine() {
    this.predestruct = function() {
        scene.remove(environment.rain)
        environment.rain = null;
        return
    }
    this.postdestruct = function() {
        return
    }
}