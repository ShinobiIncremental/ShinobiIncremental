choco.class('__shinobi', {
    constructor : function (argument) {
        var obj = arguments[0];

        this.name = obj.name !== undefined ? obj.name : '';
		this.id = obj.name !== undefined ? obj.name.toLocaleLowerCase().replace(/ /g, '') : '';
		this.rank = obj.rank !== undefined ? obj.rank : 0;
		this.level = obj.rank !== undefined ? obj.rank : 0;
		this.exp = obj.exp !== undefined ? obj.exp : [0,100];
		this.chakra = obj.chakra !== undefined ? obj.chakra : [100,100];
        this.affinities = obj.affinities !== undefined ? obj.affinities : null;
		this.skills = obj.skills !== undefined ? obj.skills : {};
		this.skillCount = obj.skillCount !== undefined ? obj.skillCount : 0;
		this.jutsus = obj.jutsus !== undefined ? obj.jutsus : {};
		this.jutsuCount = obj.jutsuCount !== undefined ? obj.jutsuCount : 0;
		this.clan = obj.clan !== undefined ? obj.clan : '';
		this.village = obj.village !== undefined ? obj.village : '';

        return this;
    }, addSkills : function () {
        if(arguments[0] instanceof Array) {
            var len = arguments[0].length;
            for (var i = 0 ; i < len ; i++) {
                var skill = arguments[0][i];
				this.skills[skill.id] = {
					id		: skill.id
                    , level   	: 1
                    , exp     	: [0,100]
                };
        		this.skillCount++;
            }
        } else {
            var len = arguments.length;
            for (var i = 0 ; i < len ; i++) {
                var skill = arguments[i];
				this.skills[skill.id] = {
					id		: skill.id
                    , level   	: 1
                    , exp     	: [0,100]
                };
        		this.skillCount++;
            }
        }
		return this;
	}, addJutsus : function () {
        if(arguments[0] instanceof Array) {
            var len = arguments[0].length;
            for (var i = 0 ; i < len ; i++) {
                var jutsu = arguments[0][i];
				this.jutsus[jutsu.id] = {
					id		: jutsu.id
                    , level   	: 1
                    , exp     	: [0,100]
                };
        		this.skillCount++;
            }
        } else {
            var len = arguments.length;
            for (var i = 0 ; i < len ; i++) {
                var jutsu = arguments[i];
				this.jutsus[jutsu.id] = {
					id		: jutsu.id
                    , level   	: 1
                    , exp     	: [0,100]
                };
        		this.jutsuCount++;
            }
        }
		return this;
	}
});

choco.class('__village', {

    constructor : function ( ){
        var obj = arguments[0];

        this.name = obj.name !== undefined ? obj.name : '';
		this.id = obj.name !== undefined ? obj.name.toLocaleLowerCase().replace(/ /g, '') : '';
		this.clans =  obj.clans !== undefined ? obj.clans : [];

		return this;
    }, addClan : function (clan) {
        this.clans.push(clan.id);
        clan.village = this.id;

		return this;
	}
});

choco.class('__clan', {

    constructor : function () {
        var obj = arguments[0];

        this.name = obj.name !== undefined ? obj.name : '';
		this.id = obj.name !== undefined ? obj.name.toLocaleLowerCase().replace(/ /g, '') : '';
		this.members = obj.members !== undefined ? obj.members : [];
        this.village = obj.village !== undefined ? obj.village : '';

		return this;
    }, addMember : function (shinobi) {
        this.members.push(shinobi.id);
        shinobi.clan = this.id
        shinobi.village = this.village;

		return this;
	}
});

choco.class('__skill', {
    constructor : function () {
        var obj = arguments[0];

        this.name = obj.name !== undefined ? obj.name : '';
		this.id = obj.name !== undefined ? obj.name.toLocaleLowerCase().replace(/ /g, '') : '';
		this.trainDescription = obj.trainDescription !== undefined ? obj.trainDescription : '';
		return this;
    }
});

choco.class('__jutsu', {

    constructor : function () {
        var obj = arguments[0];

        this.name = obj.name !== undefined ? obj.name : '';
		this.id = obj.name !== undefined ? obj.name.toLocaleLowerCase().replace(/ /g, '') : '';
        this.trainDescription = obj.trainDescription !== undefined ? obj.trainDescription : '';
		this.chakra = obj.chakra !== undefined ? obj.chakra : 100;

		return this;
    }
});
