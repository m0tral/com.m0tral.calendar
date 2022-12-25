import interconnect from '@system.interconnect';

export default {

    sendMessage(msg) {
        var conn = interconnect.instance();
        conn.send({ data: { data: msg } });
    },

    sayHelo() {
        this.sendMessage("Calendar started");
    },

    sayBye() {
        this.sendMessage("Calendar closed");
    }
}