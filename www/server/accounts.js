ServiceConfiguration.configurations.remove({
    service: "twitter"
});

ServiceConfiguration.configurations.insert({
    service: "twitter",
    consumerKey: Meteor.settings.private.login_config.twitter.consumerKey,
    secret: Meteor.settings.private.login_config.twitter.secret
});

ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: Meteor.settings.private.login_config.facebook.appId,
    secret: Meteor.settings.private.login_config.facebook.secret
});

ServiceConfiguration.configurations.remove({
    service: "google"
});

ServiceConfiguration.configurations.insert({
    service: "google",
    clientId: Meteor.settings.private.login_config.google.clientId,
    secret: Meteor.settings.private.login_config.google.secret
});

Accounts.onCreateUser(function(options, user) {
    console.log('User created: ' + JSON.stringify(user));
    user.profile = options.profile;
    user.profile.creationDate = new Date();
    if (user.services.google) {
        user.profile.picture = user.services.google.picture;
    	user.profile.email = user.services.google.email;
        user.profile.service = 'google';
    } else if (user.services.facebook) {
        user.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    	user.profile.email = user.services.facebook.email;
        user.profile.service = 'facebook';
    } else if (user.services.twitter) {
    	user.profile.picture = user.services.twitter.profile_image_url;
    	user.profile.email = user.services.twitter.email;
        user.profile.service = 'twitter';
    } else {
        if (user.emails.length > 0) {
            user.profile.email = user.emails[0].address;
        }
        Meteor.setTimeout(function() {
            Accounts.sendVerificationEmail(user._id);
        }, 2000);
    }

    return user;
});
