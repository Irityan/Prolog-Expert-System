class TemplateItem {
	constructor(id, name, type, prologName) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.prologName = prologName;
	}
}

class TemplateItemTable extends TemplateItem {
	constructor(id, name, type, prologName, tableData) {
		super(id, name, type, prologName);
		this.tableData = tableData;
	}
}

class TemplateItemProlog extends TemplateItem {
	constructor(id, name, type, prologName, prologRule) {
		super(id, name, type, prologName);
		this.prologRule = prologRule;
	}
}

class ReportTemplateArray extends Array {
	isNameUsed(name) {
		for (var item in this) {
			if (name == this[item].name) {
				return true;
			}
		}
		return false;
	}

	isPrologNameUsed(name) {
		for (var item in this) {
			if (name == this[item].prologName) {
				return true;
			}
		}
		return false;
	}

	changePosition(from, to) {
		if (to == from) {
			return;
		}
		this.splice(to, 0, this.splice(from, 1)[0]);
	}
}