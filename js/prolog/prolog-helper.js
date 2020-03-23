class PrologHelper {
    static isValidPredicatName(name) {
        return name.match(/^[a-z][0-9a-zA-Z_]*$/) != null;
    }    

    static isValidRuleDefiniton (rule) {
        return true; //TEMP
    }

    static getCommandsFromTemplate(template) {
        let  database = [];
        
        database.push(`reportName(Id, Answer)`);

        let templateItems = template["templateBody"];
        for(var i in templateItems) {
            database.push(`${templateItems[i]["prologName"]}(Id, Answer)`);
        }

        return database;
    }
}
