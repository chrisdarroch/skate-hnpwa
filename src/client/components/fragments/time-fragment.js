export default function timeFragment(time) {
    const el = document.createElement('time');
    if (typeof time === 'number') {
        const dateTime = new Date(time * 1000);
        el.setAttribute('datetime', dateTime.toISOString());
        el.innerText = dateTime.toString();
    }
    return el;
};
