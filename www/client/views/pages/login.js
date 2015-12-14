Template.login.helpers({
    'resetPassword': function() {
        return Session.get('forgot-password');
    },
    'createUser': function() {
        return Session.get('create-user');
    },
    'login': function() {
        if (Session.get('forgot-password') || Session.get('create-user')) {
            return;
        } else {
            return true;
        }
    }
});

Template.login.rendered = function() {
    Session.set('create-user', false);
    Session.set('forgot-password', false);
};

Template.login.events({
    'click .forgot-password': function(event) {
        Session.set('forgot-password', true);
        Session.set('create-user', false);
    },
    'click .btn-password-reset': function(event) {
        Session.set('login-action', 'reset-password');
    },
    'click .btn-back': function(event) {
        Session.set('forgot-password', false);
        Session.set('create-user', false);
    },
   'click .btn-create-account': function (event) {
        Session.set('create-user', true);
    },
   'click .btn-facebook': function (event) {
        Session.set('login-action', 'Facebook');
        Meteor.loginWithFacebook({}, loginCallback); 
    },
    'click .btn-google': function (event) {
        Session.set('login-action', 'Google');
        Meteor.loginWithGoogle({
            requestPermissions: ['email'],
            loginStyle: "popup"
        }, loginCallback);
    },
    'click .btn-twitter': function (event) {
        Session.set('login-action', 'Twitter');
        Meteor.loginWithTwitter({
            loginStyle: "popup"
        }, loginCallback);
    },
    'submit #reset-password': function (event) {
        event.preventDefault();
        var email = $('[name="email"]').val();
        Accounts.forgotPassword({email: email}, function(err) {
            if (err) {
                if (err.message === 'User not found [403]') {
                    swal({
                        title: "Email does not exist!",
                        text: "There is no account associated with this email address.",
                        type: "warning"
                    });
                    console.log('This email does not exist.');
                } else {
                    swal({
                        title: "Reset Failed!",
                        text: "Something went wrong while trying to reset your password. Please try again.",
                        type: "warning"
                    });
                    console.log('We are sorry but something went wrong.');
                }
            } else {
                swal({
                    title: "Password reset email sent!",
                    text: "Instructions for resetting your password have been sent to your email address.",
                    type: "success"
                });
                console.log('Email Sent. Check your mailbox.');
            }
        });
    },
    'submit #create-user': function (event) {
        event.preventDefault();
        var email = $('[name="email"]').val();
        var password = $('[name="password"]').val();
        var firstName = $('[name="firstname"]').val();
        var lastName = $('[name="lastname"]').val();
        var user = { email: email, password: password, profile: { firstName: firstName, lastName: lastName, name: firstName + ' ' + lastName}};
        Accounts.createUser(user, function (error) {
            if (error) {
		swal({
		    title: "Error Creating Account",
		    text: error.reason,
		    type: "error"
		});
                console.log('Error creating account: ' + error);    
            } else {
                swal({
                    title: "Account Created!",
                    text: "Account created successfully! Check your email for a verification message.",
                    type: "success"
                });
                console.log('Account created!');
                Router.go('dashboard');
            }
        });
    },
    'submit #login': function (event) {
        event.preventDefault();
        console.log('Form submitted. Action: ' + Session.get('login-action'));
        var email = $('[name="email"]').val();
        var password = $('[name="password"]').val();
        var user = { email: email, password: password };
        Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
                console.log('Login failed with error: ' + error);
                swal({
                    title: "Login Failed",
                    text: ''+error,
                    type: "warning"
                });
            } else {
                console.log('Login Successful');
                swal({
                    title: "Login Successful!",
                    text: "Welcome back.",
                    type: "success"
                });
                Router.go('dashboard');
            }
        });
    }
});

var loginCallback = function(error) {
    var loginType = Session.get('login-action');
    if (error) {
        console.log('Error logging in with ' + loginType + ': ' + error);
        if (error && error.toString().indexOf('ServiceConfiguration.ConfigError') >= 0) {
            swal({
                title: "Login Failure",
                text: "Oops! Login system not ready yet. Try again.",
                type: "error"
            });
        } else {
            swal({
                title: "Login Failure",
                text: "Something went wrong during your log in attempt. Please try again or contact service@relaysupply.com for support.",
                type: "error"
            });
        }
    } else {
        console.log('Login with ' + loginType + ' successful!');
        swal({
            title: "Login Successful",
            text: "Logged in with " + loginType + " successfully.",
            type: "success"
        });
        Router.go('/dashboard');
    }
};
