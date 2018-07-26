AFRAME.registerComponent('school-playground', {
    init: function () {
      // Solution for Getting Entities.
      var sceneEl = document.querySelector('a-scene');  // Or this.el since we're in a component.
      console.log(sceneEl);
      console.log("wowwowo")
      console.log(sceneEl.querySelectorAll('a-entity'));
      console.log(sceneEl.querySelector('a-box'));
      console.log(sceneEl.querySelectorAll('a-sphere, a-cylinder'));
      console.log(sceneEl.querySelectorAll('.coolshape'));
    }
  });