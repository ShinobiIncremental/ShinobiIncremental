choco.subscribe('loadListener', 'ready', function (data) {
    this.gameData.clans['uzumaki'] = this.__clan({
		name : 'Uzumaki'
	});

	this.gameData.clans['uchiha'] = this.__clan({
		name : 'Uchiha'
	});

	this.gameData.clans['hyuga'] = this.__clan({
		name : 'Hyuga'
	});

	this.gameData.villages['leaf'] = this.__village({
		name : 'Leaf'
	})
		.addClan(this.gameData.clans['uzumaki'])
		.addClan(this.gameData.clans['uchiha'])
		.addClan(this.gameData.clans['hyuga']);

    this.loadGame();
    if (this.gameData.started) {
        this.player = this.gameData.shinobis[this.gameData.player.shinobi];
        document.body.innerHTML = this.template('gameContainer');
        this.ele('.__sidebar').innerHTML = this.template('sidebar');
        this.ele('.__actionDetails').innerHTML = this.template('actionDetails');
        this.ele('.__actionBar').innerHTML = this.template('bar', {w: 75, p: 0});
        this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"'+this.gameData.player.action.description+'"');
    } else {
        document.body.innerHTML = this.template('createCharacter');
    }
	this.player = this.gameData.shinobis[this.gameData.player.shinobi];
	requestAnimFrame(this.updateLoop.bind(this));
})

choco.subscribe('clickListener', 'beginGame', function () {
    this.gameData.started = true;
    var name = this.ele('.__char_create_name').value;
    var clan = this.ele('.__char_create_clan').value;

    this.player = this.gameData.shinobis[name.toLocaleLowerCase().replace(/ /g, '')] = this.__shinobi({
        name: name
    });

    this.player.affinities = this.affinitiesDice();

    this.gameData.player.shinobi = this.player.id;
    this.gameData.clans[clan].addMember(this.player);

    this.player.addSkills(
        this.skills.kunai
        , this.skills.shuriken
        , this.skills.chakracontrol
	);

    this.player.addJutsus(
		this.jutsus.bunshinnojutsu
	);

    document.body.innerHTML = this.template('gameContainer');
    this.ele('.__sidebar').innerHTML = this.template('sidebar');
    this.ele('.__actionDetails').innerHTML = this.template('actionDetails');
    this.ele('.__actionBar').innerHTML = this.template('bar', {w: 75, p: 0});
    this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"'+player.action.description+'"');
    this.saveGame();
});

choco.subscribe('clickListener', 'trainSkill', function (data) {
    if  ( this.gameData.player.action.active ) { return 0 }
    this.gameData.tmp.ele = data.e.target.tagName === "TD"
                ? data.e.target.parentElement
                : data.e.target;
	this.gameData.delta = +(new Date)-1;
    this.publish('playerTrain', 'trainSkill', {skill: data.data})
})

choco.subscribe('clickListener', 'trainJutsu', function (data) {
    if  ( this.gameData.player.action.active ) { return 0 }
    this.gameData.tmp.ele = data.e.target.tagName === "TD"
                ? data.e.target.parentElement
                : data.e.target;
	this.gameData.delta = +(new Date)-1;
	this.publish('playerTrain', 'trainJutsu', {jutsu: data.data})
})

choco.subscribe('clickListener', 'piCollapse', function (data) {
    var arr = this.ele('.__PIList');
    var len = arr.length;
    while ( len-- ) {
        if( arr[len] === this.ele(data.data) ) {
            arr[len].style.height = "200px";
        } else {
            arr[len].style.height = "0px";
        }
    }
})

choco.subscribe('playerTrain', 'trainSkill', function (data) {
	var player = this.gameData.player;
	var skill = this.player.skills[data.skill];
	if (player.action.active) {
		return -1
	} else {
		player.action = {
			description : this.skills[skill.id].trainDescription !== undefined? this.skills[skill.id].trainDescription : 'Learning how to use ' + skill.name
			, timer		: [0, 1000+skill.level*750]
			, active	: true
			, done		: function () {
				skill.exp[0] = (skill.exp[0]+100*( ((Math.random()*4+3)*0.1*skill.level*1.1) ).toFixed(2))|0;
				if (skill.exp[0] >= skill.exp[1]) {
					skill.exp[0] -= skill.exp[1];
					skill.exp[1] = Math.abs(Math.tan(Math.PI/180*skill.level)*10000|0)
					skill.level++;
					if(skill.level === 91) {
						// Skill mastery
					}

				}
				this.gameData.tmp.ele.innerHTML = this.template('skillRow', skill);
	            this.saveGame();
			}
		}
		this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"'+player.action.description+'"');
	}
})

choco.subscribe('playerTrain', 'trainJutsu', function (data) {
	var player = this.gameData.player;
	var jutsu = this.gameData.shinobis[player.shinobi].jutsus[data.jutsu];

	if (player.action.active) {
		return -1;
	} else {
		player.action = {
			description : this.jutsus[jutsu.id].trainDescription !== undefined? this.jutsus[jutsu.id].trainDescription : 'Learning how to use ' + jutsu.name
			, timer		: [0, 1000+jutsu.level*750]
			, active	: true
			, done		: function () {
				jutsu.exp[0] = (jutsu.exp[0]+100*( ((Math.random()*4+3)*0.1*jutsu.level*1.1) ).toFixed(2))|0;
				if (jutsu.exp[0] >= jutsu.exp[1]) {
					jutsu.exp[0] -= jutsu.exp[1];
					jutsu.exp[1] = Math.abs(Math.tan(Math.PI/180*jutsu.level)*10000|0)
					jutsu.level++;
					if(jutsu.level === 91) {
						// Skill mastery
					}

				}
				this.gameData.tmp.ele.innerHTML = this.template('jutsuRow', jutsu);
				this.saveGame();
			}
		}
		this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"'+player.action.description+'"');
	}
})

choco.subscribe('clickListener', 'academyAttempt', function () {
	var str = '';
	this.gameData.delta = +(new Date)-1;

	var player = this.gameData.player;
	var difficulty = Math.random()*15+15;
	var p_jutsu = this.player.jutsus.bunshinnojutsu;
	var p_cc    = this.player.skills.chakracontrol;
	var jpower = p_jutsu.level+(p_jutsu.exp[0]/p_jutsu.exp[1]);
	var ccpower = p_cc.level+(p_cc.exp[0]/p_cc.exp[1]);

	var w = Math.random()*ccpower+jpower;
	var q = difficulty-w;
	if (q <= 0 || w/2 > q) {
		if (this.useJutsu(this.player.id,'bunshinnojutsu') ) {
			player.action = {
				description : 'Desperately trying to pass Academy Exam...'
				, timer		: [0, 6000]
				, active	: true
				, tick		: [{
                    from    : 1500
                    , once  : true
                    , fun   : function (action) {
    					action.description = 'Performing Bunshi no Jutsu'
    					this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"'+player.action.description+'"');
                    }
                }, {
                    from    : 3000
                    , once  : true
                    , fun   : function (action) {
						action.description = 'High-fiveing with clone'
						this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"'+player.action.description+'"');
                    }
                }]
				, done		: function (action) {
				}
			}
			this.ele('.__actionDescription').innerHTML = this.template('actionDescription', '"'+player.action.description+'"');
		}

	}

})
