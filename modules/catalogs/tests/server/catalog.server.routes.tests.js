'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Catalog = mongoose.model('Catalog'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  catalog;

/**
 * Catalog routes tests
 */
describe('Catalog CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Catalog
    user.save(function () {
      catalog = {
        name: 'Catalog name'
      };

      done();
    });
  });

  it('should be able to save a Catalog if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Catalog
        agent.post('/api/catalogs')
          .send(catalog)
          .expect(200)
          .end(function (catalogSaveErr, catalogSaveRes) {
            // Handle Catalog save error
            if (catalogSaveErr) {
              return done(catalogSaveErr);
            }

            // Get a list of Catalogs
            agent.get('/api/catalogs')
              .end(function (catalogsGetErr, catalogsGetRes) {
                // Handle Catalogs save error
                if (catalogsGetErr) {
                  return done(catalogsGetErr);
                }

                // Get Catalogs list
                var catalogs = catalogsGetRes.body;

                // Set assertions
                (catalogs[0].user._id).should.equal(userId);
                (catalogs[0].name).should.match('Catalog name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Catalog if not logged in', function (done) {
    agent.post('/api/catalogs')
      .send(catalog)
      .expect(403)
      .end(function (catalogSaveErr, catalogSaveRes) {
        // Call the assertion callback
        done(catalogSaveErr);
      });
  });

  it('should not be able to save an Catalog if no name is provided', function (done) {
    // Invalidate name field
    catalog.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Catalog
        agent.post('/api/catalogs')
          .send(catalog)
          .expect(400)
          .end(function (catalogSaveErr, catalogSaveRes) {
            // Set message assertion
            (catalogSaveRes.body.message).should.match('Please fill Catalog name');

            // Handle Catalog save error
            done(catalogSaveErr);
          });
      });
  });

  it('should be able to update an Catalog if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Catalog
        agent.post('/api/catalogs')
          .send(catalog)
          .expect(200)
          .end(function (catalogSaveErr, catalogSaveRes) {
            // Handle Catalog save error
            if (catalogSaveErr) {
              return done(catalogSaveErr);
            }

            // Update Catalog name
            catalog.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Catalog
            agent.put('/api/catalogs/' + catalogSaveRes.body._id)
              .send(catalog)
              .expect(200)
              .end(function (catalogUpdateErr, catalogUpdateRes) {
                // Handle Catalog update error
                if (catalogUpdateErr) {
                  return done(catalogUpdateErr);
                }

                // Set assertions
                (catalogUpdateRes.body._id).should.equal(catalogSaveRes.body._id);
                (catalogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Catalogs if not signed in', function (done) {
    // Create new Catalog model instance
    var catalogObj = new Catalog(catalog);

    // Save the catalog
    catalogObj.save(function () {
      // Request Catalogs
      request(app).get('/api/catalogs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Catalog if not signed in', function (done) {
    // Create new Catalog model instance
    var catalogObj = new Catalog(catalog);

    // Save the Catalog
    catalogObj.save(function () {
      request(app).get('/api/catalogs/' + catalogObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', catalog.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Catalog with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/catalogs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Catalog is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Catalog which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Catalog
    request(app).get('/api/catalogs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Catalog with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Catalog if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Catalog
        agent.post('/api/catalogs')
          .send(catalog)
          .expect(200)
          .end(function (catalogSaveErr, catalogSaveRes) {
            // Handle Catalog save error
            if (catalogSaveErr) {
              return done(catalogSaveErr);
            }

            // Delete an existing Catalog
            agent.delete('/api/catalogs/' + catalogSaveRes.body._id)
              .send(catalog)
              .expect(200)
              .end(function (catalogDeleteErr, catalogDeleteRes) {
                // Handle catalog error error
                if (catalogDeleteErr) {
                  return done(catalogDeleteErr);
                }

                // Set assertions
                (catalogDeleteRes.body._id).should.equal(catalogSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Catalog if not signed in', function (done) {
    // Set Catalog user
    catalog.user = user;

    // Create new Catalog model instance
    var catalogObj = new Catalog(catalog);

    // Save the Catalog
    catalogObj.save(function () {
      // Try deleting Catalog
      request(app).delete('/api/catalogs/' + catalogObj._id)
        .expect(403)
        .end(function (catalogDeleteErr, catalogDeleteRes) {
          // Set message assertion
          (catalogDeleteRes.body.message).should.match('User is not authorized');

          // Handle Catalog error error
          done(catalogDeleteErr);
        });

    });
  });

  it('should be able to get a single Catalog that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Catalog
          agent.post('/api/catalogs')
            .send(catalog)
            .expect(200)
            .end(function (catalogSaveErr, catalogSaveRes) {
              // Handle Catalog save error
              if (catalogSaveErr) {
                return done(catalogSaveErr);
              }

              // Set assertions on new Catalog
              (catalogSaveRes.body.name).should.equal(catalog.name);
              should.exist(catalogSaveRes.body.user);
              should.equal(catalogSaveRes.body.user._id, orphanId);

              // force the Catalog to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Catalog
                    agent.get('/api/catalogs/' + catalogSaveRes.body._id)
                      .expect(200)
                      .end(function (catalogInfoErr, catalogInfoRes) {
                        // Handle Catalog error
                        if (catalogInfoErr) {
                          return done(catalogInfoErr);
                        }

                        // Set assertions
                        (catalogInfoRes.body._id).should.equal(catalogSaveRes.body._id);
                        (catalogInfoRes.body.name).should.equal(catalog.name);
                        should.equal(catalogInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Catalog.remove().exec(done);
    });
  });
});
