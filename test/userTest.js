import { expect, should } from "chai";
import chaiHttp from "chai-http";
import server from "../server.js"; // Adjust path as necessary
import User from "../models/userModel.js"; // Adjust path as necessary
import mongoose from "mongoose";

should(); // Enable should-style assertions directly

chai.use(chaiHttp);

describe("Users API", () => {
  // Before each test, clear the User collection
  beforeEach((done) => {
    // Clear the User collection
    User.deleteMany({}, (err) => {
      done();
    });
  });

  /*
   * Test the /GET route
   */
  describe("/GET user", () => {
    it("it should GET all the users", (done) => {
      chai
        .request(server)
        .get("/worko/user")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          res.body.length.should.be.eql(0); // Assuming initially there are no users
          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST user", () => {
    it("it should not POST a user without email field", (done) => {
      let user = {
        name: "John Doe",
        age: "25",
        city: "New York",
        zipcode: 10001,
      };
      chai
        .request(server)
        .post("/worko/user")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a("object");
          res.body.should.have
            .property("message")
            .eql("User validation failed: email: Path `email` is required.");
          done();
        });
    });

    it("it should POST a user", (done) => {
      let user = {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        age: "25",
        city: "New York",
        zipcode: 10001,
      };
      chai
        .request(server)
        .post("/worko/user")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("_id");
          res.body.should.have.property("name").eql("John Doe");
          res.body.should.have.property("email").eql("johndoe@example.com");
          done();
        });
    });
  });

  /*
   * Test the /GET/:id route
   */
  describe("/GET/:id user", () => {
    it("it should GET a user by the given id", (done) => {
      let user = new User({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        age: "25",
        city: "New York",
        zipcode: 10001,
      });
      user.save((err, user) => {
        chai
          .request(server)
          .get("/worko/user/" + user._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("_id").eql(user._id.toString());
            res.body.should.have.property("name").eql("John Doe");
            res.body.should.have.property("email").eql("johndoe@example.com");
            done();
          });
      });
    });
  });

  /*
   * Test the /PUT/:id route
   */
  describe("/PUT/:id user", () => {
    it("it should UPDATE a user given the id", (done) => {
      let user = new User({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        age: "25",
        city: "New York",
        zipcode: 10001,
      });
      user.save((err, user) => {
        chai
          .request(server)
          .put("/worko/user/" + user._id)
          .send({ name: "Jane Doe" })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("name").eql("Jane Doe");
            done();
          });
      });
    });
  });

  /*
   * Test the /DELETE/:id route
   */
  describe("/DELETE/:id user", () => {
    it("it should DELETE a user given the id", (done) => {
      let user = new User({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "password123",
        age: "25",
        city: "New York",
        zipcode: 10001,
      });
      user.save((err, user) => {
        chai
          .request(server)
          .delete("/worko/user/" + user._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have
              .property("message")
              .eql("User deleted successfully");
            done();
          });
      });
    });
  });

  // After all tests are complete, close the MongoDB connection
  after((done) => {
    mongoose.connection.close();
    done();
  });
});
