const {expect} = require('chai');

const requestGraphQL = require('./client');

describe('query', function() {
  it('should get all objects', () => {
    return requestGraphQL(`
      query {
        Todo {
          objectId, title, priority, createdAt
        }
      }
    `).then( res => {
      res.body.data.Todo.forEach( ({objectId, title, priority, createdAt}) => {
        objectId.should.be.a('string');
        title.should.be.a('string');
        priority.should.be.a('number');
        createdAt.should.be.a('string');
      });
    });
  });

  it('should sort by priority', () => {
    return requestGraphQL(`
      query {
        Todo(ascending: priority) {
          title, priority
        }
      }
    `).then( res => {
      res.body.data.Todo.reduce( (previous, {priority}) => {
        priority.should.least(previous);
        return priority;
      }, -Infinity);
    });
  });

  it('should get only 2 objects', () => {
    return requestGraphQL(`
      query {
        Todo(limit: 2) {
          title, priority
        }
      }
    `).then( res => {
      res.body.data.Todo.length.should.be.equal(2);
    });
  });

  it('should get object by id', () => {
    return requestGraphQL(`
      query {
        Todo(objectId: "5853a0e5128fe1006b5ce449") {
          title
        }
      }
    `).then( res => {
      res.body.data.Todo.length.should.be.equal(1);
      res.body.data.Todo[0].title.should.be.equal('还信用卡账单');
    });
  });

  it('should work with equalTo', () => {
    return requestGraphQL(`
      query {
        Todo(equalTo: {title: "团队会议"}) {
          title
        }
      }
    `).then( res => {
      res.body.data.Todo.length.should.be.equal(1);
      res.body.data.Todo[0].title.should.be.equal('团队会议');
    });
  });

  it('should work with greaterThanOrEqualTo', () => {
    return requestGraphQL(`
      query {
        Todo(greaterThanOrEqualTo: {priority: 10}) {
          title, priority
        }
      }
    `).then( res => {
      res.body.data.Todo.forEach( ({priority}) => {
        priority.should.least(10);
      });
    });
  });

  it('should work with containedIn', () => {
    return requestGraphQL(`
      query {
        Todo(containedIn: {tags: ["Online"]}) {
          title, tags
        }
      }
    `).then( res => {
      res.body.data.Todo.forEach( ({tags}) => {
        tags.should.eql(['Online']);
      });
    });
  });

  it('should work with exists', () => {
    return requestGraphQL(`
      query {
        Todo(exists: {title: true, content: false}) {
          title, content
        }
      }
    `).then( res => {
      res.body.data.Todo.forEach( ({title, content}) => {
        title.should.be.a('string');
        expect(content).to.not.exist;
      });
    });
  });
});
