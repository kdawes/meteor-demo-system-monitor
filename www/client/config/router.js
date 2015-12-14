Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound'
});

Router.onBeforeAction(function() {
    if (!(Meteor.user() || Meteor.loggingIn())) {
        Router.go('login');
    }
    this.next();
}, {except: ['login', 'home']});

Router.onBeforeAction(function() {
    if (Meteor.user().profile.isAdmin) {
        this.next();
    } else {
        this.redirect('/');
    }
}, { only: ['administration'] });

Router.onBeforeAction(function() {
    if (Meteor.user()) {
        Router.go('/');
    } else {
        this.next();
    }
}, {only: ['login']});

Router.route('/', {
     name: 'home',
     waitOn: function() {
        if (!Meteor.user()) {
            return;
        }
    },
    action: function() {
        this.render();
    }
});

Router.route('/logout', {
    name: 'logout',
    action: function() {
        this.render();
    }
});

Router.route('/login', {
    waitOn: function() {
        Accounts.loginServicesConfigured();
    },
});

Router.route('/forgotPassword', function() {
    this.render();
});
