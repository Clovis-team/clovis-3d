// AFRAME.registerComponent('clovis',{
//     init: function () {
//         document.querySelector('a-scene').setAttribute('log', 'message: Hello fucker!');
//     }
// });

AFRAME.registerComponent('log', {
    schema: {
      message: {type: 'string', default: 'Hello, World!'},
      event: {type: 'string', default: ''},
    },
  
    init: function () {
      
    },

    update: function () {
        var data = this.data;  // Component property values.
        var el = this.el;  // Reference to the component's entity.

        if (data.event) {
        // This will log the `message` when the entity emits the `event`.
        el.addEventListener(data.event, function () {
            console.log(data.message);
        });
        } else {
        // `event` not specified, just log the message.
        console.log(data.message);
        }

    }
  });
