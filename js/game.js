choco.define('ranks', {
    0 : {
        name : 'Academy Student'
    }
    , 1 : {
        name : 'Genin'
    }
    , 2 : {
        name : 'Chūnin'
    }
    , 3 : {
        name : 'Jōnin'
    }
});

choco.define('affinities', ['fire', 'earth', 'water', 'wind', 'lighting'])

choco.define('skills', function(){
    return {
        'kunai' : new this.__skill({
            name: 'Kunai',
            trainDescription: 'Learning to stab with Kunais'
        })
        , 'shuriken' : new this.__skill({
            name: 'Shuriken'
            , trainDescription: 'Learning how to throw Shurikens'
        })
        , 'chakracontrol' : new this.__skill({
            name: 'Chakra Control'
            , trainDescription: 'Improving Chakra Control'
        })
    }
});

choco.define('jutsus', function(){
    return {
        'bunshinnojutsu' : new this.__jutsu({
            name: 'Bunshin no Jutsu'
            , trainDescription: 'Desperately trying to prepare for Academy Exam...'
			, chakra: 37
        })
    }
});

choco.define('gameData', {
    started 	: false
    , delta		: +(new Date())
	, lastSave	: +(new Date())
    , tmp 		: {}
    , player 	: {
        shinobi : ''
        , action: {
            description : ''
            , timer 	: [0, 0]
            , active	: false
        }
    }
    , shinobis : {

    }
    , clans : {

    }
    , villages : {

    }
});

choco.define('names', {
    f: ['girly'],
    m: ['lad']
})

choco.fun('affinitiesDice', function () {
    var r = Math.random()*100+1|0;
    var c = r <= 75
            ? 1
            : r <= 98
              ? 2
              : 3;
    var aff = [];

    for ( var i = 0 ; i < c ; i++ ) {
        var l = true;
        while(l) {
            var r = Math.random()*5|0;
            var a = this.affinities[r];
            if (aff.indexOf(a) > 0) {
                l = true
            } else {
                aff.push(a);
                l = false;
            }
        }
    }
    return aff;
})

choco.fun('useJutsu', function () {
	var shinobi = arguments[0] !== undefined ? this.gameData.shinobis[arguments[0]] : this.player;
	var jutsu   = arguments[1] !== undefined ? shinobi.jutsus[arguments[1]] : undefined;
	var chakra  = this.jutsus[jutsu.id].chakra * ((100-shinobi.skills.chakracontrol.level)/99);
	if ( shinobi.chakra[0] > chakra ) {
		shinobi.chakra[0] = (shinobi.chakra[0] - chakra).toFixed(2)
		return 1;
	} else {
		return 0;
	}

})

choco.fun('saveGame', function () {
	this.gameData.lastSave = +(new Date());
    localStorage['game_data'] = JSON.stringify(this.gameData);
})

choco.fun('loadGame', function () {
    this.gameData = localStorage['game_data'] !== undefined && localStorage['game_data'] !== ''  ? JSON.parse(localStorage['game_data']) : this.gameData;
    for ( var key in this.gameData.villages ) {

        var village = this.gameData.villages[key];

        this.gameData.villages[key] = new this.__village(village);
    }

    for ( var key in this.gameData.clans ) {
        var clan = this.gameData.clans[key];
        this.gameData.clans[key] = new this.__clan(clan);
    }

    for ( var key in this.gameData.shinobis ) {
        var shinobi = this.gameData.shinobis[key];
        this.gameData.shinobis[key] = new this.__shinobi(shinobi);
    }
})

choco.fun('performAction', function() {
	var player 	= this.gameData.player;
	if (!player.action.active) {
		this.gameData.delta = +(new Date)-1;

		var obj		= arguments[0];

		player.action = {
			description : obj.description 	!== undefined ? obj.description : ''
			, timer		: obj.timer			!== undefined ? obj.timer		: [0,10000]
			, active	: true
			, tick		: obj.tick			!== undefined ? obj.tick		: undefined
			, done		: obj.done			!== undefined ? obj.done		: undefined
		}

		this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"'+player.action.description+'"');
	}
});

choco.fun('updateLoop', function () {
	var now = +(new Date);
	var player = this.gameData.player;
	if (player.action.active) {
		if (player.action.timer[0] >= player.action.timer[1]) {
			player.action.timer[0] = player.action.timer[1];
			player.action.done !== undefined
			? player.action.done.call(this, player.action)
			: void 0;
			player.action = {
				description : 'Idleing...'
				, timer		: [0, 1]
				, active	: false
			}
			this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"Idleing..."', 'description');
		} else {
			player.action.timer[0] += now-this.gameData.delta;
            if (player.action.tick !== undefined && player.action.tick instanceof Function) {
                player.action.tick.call(this, player.action);
            } else if(player.action.tick !== undefined && player.action.tick instanceof Array) {
                var len = player.action.tick.length;
                for (var i = 0 ; i < len ; i++) {
                    var t = player.action.tick[i];
                    if (player.action.timer[0] >= t.from && (t.to !== undefined && player.action.timer[0] <= t.to || t.once) ) {
                        t.fun.call(this, player.action);
                        if (t.once) {
                            player.action.tick.splice(t,1)
                            len--;
                            i--;
                        }
                    }
                }
            }
			this.gameData.delta = now;

		}
		this.ele('.__actionBar').innerHTML = this.template('bar', {w: 75, p: (player.action.timer[0]/player.action.timer[1]*100).toFixed(2)});
	}
	if (this.gameData.lastSave+30000 <= (+new Date())) {
		this.saveGame();
	}
	requestAnimFrame(this.updateLoop.bind(this));
})
