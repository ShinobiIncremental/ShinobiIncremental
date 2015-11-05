choco.addTemplate('createCharacter', '<div><table><tr>\
            <td colspan=2>Create your shinobi!</td>\
        </tr><tr>\
            <td>\
                <label>Name</label>\
            </td><td>\
                <input type="text" class="__char_create_name"></input>\
            </td>\
        </tr><tr>\
            <td>\
                <label>Clan</label>\
            </td><td>\
                <select class="__char_create_clan">\
                    {{foreach this.gameData.clans as clan}}<option value="{{clan.id}}">{{clan.name}}</option>{{end foreach}}\
                </select>\
            </td>\
        </tr><tr>\
            <td>\
                <label>Gender</label>\
            </td><td>\
                <select class="__char_create_gender">\
                    <option value="male">Male</option>\
                    <option value="female">Female</option>\
                </select>\
            </td>\
        </tr><tr>\
            <td colspan=2>\
                <button choco-pubtopic="beginGame"> Something something, about birth </button>\
            </td>\
        </tr>\
    </table>\
</div>');

choco.addTemplate('gameContainer', '<div style="width: 100%; height: 100%; position: relative">\
    <div style="position: absolute; left: 1%; right: 67.166%; top: 1%; bottom: 1%; box-shadow: 0 0 4px black;" class="__sidebar">\
    </div>\
    <div style="position: absolute; left: 34.333%; right: 1%; top: 1%; bottom: 82%; box-shadow: 0 0 4px black;" class="__actionDetails">\
    </div>\
    <div style="position: absolute; left: 34.333%; right: 1%; top: 19%; bottom: 1%; box-shadow: 0 0 4px black;" class="__GI">\
    </div>\
</div>');

choco.addTemplate('sidebar', '<table style="width:100%">\
    <tr>\
        <td>&nbsp;</td>\
    </tr><tr>\
        <td colspan=2 style="text-align:center">{{this.player.name}} {{this.gameData.clans[this.player.clan].name}} of {{this.gameData.villages[this.player.village].name}}</td>\
    </tr><tr>\
        <td colspan=2 style="text-align:center"><em>{{this.ranks[this.player.rank].name}}</em></td>\
    </tr><tr>\
        <td>&nbsp;</td>\
    </tr>\
    </table>\
    {{if this.player.skills !== undefined && this.player.skillCount > 0}}\
        <span choco-pubtopic="piCollapse" choco-pubdata=".__SList"><strong>Skills</strong></span>\
        <div class="__PIList __SList" style="height:200px; overflow-y: scroll"><table style="width:100%">\
        {{foreach this.player.skills as skill}}\
            <tr choco-pubtopic="trainSkill" choco-pubdata="{{skill.id}}"><td>{{this.skills[skill.id].name}}</td><td style="text-align: right">{{skill.level}} ({{skill.exp[0]}}/{{skill.exp[1]}})</td></tr>\
        {{end foreach}}\
        </table></div>\
    {{end if}}\
    {{if this.player.jutsus !== undefined && this.player.jutsuCount > 0}}\
        <span choco-pubtopic="piCollapse" choco-pubdata=".__JList"><strong>Jutsus</strong></span>\
        <div class="__PIList __JList" style="height:0px; overflow-y: scroll"><table style="width:100%">\
        {{foreach this.player.jutsus as jutsu}}\
            <tr choco-pubtopic="trainJutsu" choco-pubdata="{{jutsu.id}}"><td>{{this.jutsus[jutsu.id].name}}</td><td style="text-align: right">{{jutsu.level}} ({{jutsu.exp[0]}}/{{jutsu.exp[1]}})</td></tr>\
        {{end foreach}}\
        </table></div>\
    {{end if}}\
	<hr></hr>\
	<span><strong>Academy</strong></span>\
	<table style="width:100%">\
		<tr choco-pubtopic="academyAttempt"><td>Attempt to pass</td><td style="text-align: right"></td></tr>\
		<tr><td></td><td style="text-align: right"></td></tr>\
	</table>');

choco.addTemplate('actionDetails', '<table style="width: 100%">\
    <tr>\
        <td colspan=2 style="text-align:center;font-size:0.5em">&nbsp;</td>\
    </tr><tr>\
        <td colspan=2 style="text-align:center">Current activity</td>\
    </tr><tr>\
        <td class="__actionBar" colspan=2></td>\
    </tr><tr>\
        <td class="__actionDescription" colspan=2 style="text-align:center"></td>\
    </tr>\
</table>');

choco.addTemplate('skillRow', '<tr choco-pubtopic="trainSkill" choco-pubdata="{{data.id}}"><td>{{this.skills[data.id].name}}</td><td style="text-align: right">{{data.level}} ({{data.exp[0]}}/{{data.exp[1]}})</td></tr>');

choco.addTemplate('jutsuRow', '<tr choco-pubtopic="trainJutsu" choco-pubdata="{{data.id}}"><td>{{this.jutsus[data.id].name}}</td><td style="text-align: right">{{data.level}} ({{data.exp[0]}}/{{data.exp[1]}})</td></tr>');

choco.addTemplate('bar', '<div style="width: {{data.w}}%; text-align: center; margin: 0 auto; border-radius: 15px; background-image: {{this.cssPrefix}}-linear-gradient(0deg, rgb(255, 0, 0), rgb(255, 0, 0) {{data.p}}%, rgb(200, 200, 200) {{data.p}}%, rgb(200, 200, 200))">{{data.p}}%</div>');

choco.addTemplate('actionDescription', '<em>{{data}}</em>');
