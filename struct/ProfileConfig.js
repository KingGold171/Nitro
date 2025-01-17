const r = require('rethinkdb')

class ProfileConfig {

    constructor(data) {

        this.profiles = {}

        data.profile.forEach(d => {
            this.profiles[d.id] = d.data;
        })

        this.conn = data.connection

    }

    update(id) {
        r.table('profile').insert({
            id,
            data: this.profiles[id]
        }, {
            conflict: "replace"
        }).run(this.conn, (err, res) => {
            if (err) console.log(err)
        })
    }

    Get(id, name, def) {
        if (this.profiles[id] && this.profiles[id][name]) return this.profiles[id][name]
        else return def
    }

    Set(id, name, n) {
        if (!this.profiles[id]) this.profiles[id] = {};
        this.profiles[id][name] = n;
        this.update(id);
    }

    addMsg(id) {
        let sent = this.getSent(id)
        sent++
        this.setSent(id, sent)
    }

    getLvl(id) {
        let sent = this.getSent(id)
        return Math.floor(sent / 259) + 1
    }

    getRank(id) {
        if (!this.profiles[id] || !this.profiles[id].sent) return "9999999"
        let keys = Object.keys(this.profiles)
        let sort = keys.sort((a, b) => {
            return this.profiles[b].sent - this.profiles[a].sent
        })
        let place = sort.indexOf(id) + 1
        return place
    }

    getSent(id) {
        return this.Get(id, 'sent', 0)
    }

    setSent(id, sent) {
        this.Set(id, 'sent', sent)
    }

    getMoney(id) {
        return this.Get(id, 'money', 0)
    }

    setMoney(id, money) {
        this.Set(id, 'money', money)
    }

    getShout(id, prefix) {
        return this.Get(id, 'shout', "Use " + prefix + "infobox <text> to set this message.")
    }

    setShout(id, shout) {
        this.Set(id, 'shout', shout)
    }

    getBg(id) {
        return this.Get(id, 'background', 'default')
    }

    setBg(id, background) {
        this.Set(id, 'background', background)
    }

}

module.exports = ProfileConfig