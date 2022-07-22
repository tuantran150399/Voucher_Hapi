var should = require('chai').should()
expect = require('chai').expect
Mongoose = require('mongoose').Mongoose
mongoose = new Mongoose
MockMongoose = require('mock-mongoose').MockMongoose
mockMongoose = new MockMongoose(mongoose)
Cat = mongoose.model('User', { name: String });


describe('User functions', function () {
	before(function (done) {
		mockMongoose.prepareStorage().then(function () {
			mongoose.connect('mongodb://localhost:27017/VoucherApplication  ', function (err) {
				console.log('connected to mongo');
				done(err);
			});
		});
	});

	it("isMocked", function () {
		expect(mockMongoose.helper.isMocked()).to.be.true;
		
	});
	it("should create a user ", function (done) {
		Cat.create({ name: "admin" }, function (err, cat) {
			expect(err).to.be.null;
			done(err);
		});
	});

	it("should find user admin", function (done) {
		Cat.findOne({ name: "admin" }, function (err, cat) {
			expect(err).to.be.null;
			expect(cat.name).to.be.equal("admin");
			done(err);
		});
	});

	it("should remove user admin", function (done) {
		Cat.deleteOne({ name: "admin" }, function (err, cat) {
			expect(err).to.be.null;
			done(err);
		});
	});

	it("reset", function () {
		mockMongoose.helper.reset().then(function () {
		});
	});

	after("Drop db", () => {
		mockMongoose.killMongo().then(function () {
		});
	});
});