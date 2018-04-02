export default function timeFragment(time) {
    const dateTime = new Date(time * 1000);
    const el = document.createElement('time');
    el.setAttribute('datetime', dateTime.toISOString());
    el.innerText = dateTime.toString();
    return el;
};
