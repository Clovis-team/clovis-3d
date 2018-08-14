

export const MenuToggle = () => {
    console.log('MenuToggle');

    if (typeof document.getElementById('three-clovis-menu') !== 'undefined') {
        if (document.getElementById('three-clovis-menu').style.display === 'absolute'
            || document.getElementById('stats-container').style.display === ''
        ) {
            document.getElementById('stats-container').style.display = 'none';
        } else {
            document.getElementById('stats-container').style.display = 'absolute';
        }
    }
};

export const Hello = 'Hello';
