Template.pageHeading.helpers({
    // Route for Home link in breadcrumbs
    home: 'home',
    pageTitle: function() {
        return Router.current().params._city;
    },
    getTitle: function() {
        var deviceId = Router.current().params._deviceId;
        var accountId = Router.current().params._accountId;
        if (deviceId) {
            var device = Devices.findOne({ _id: deviceId });
            if (device) {
                return device.deviceName;
            } else {
                console.log('No device found!');
            }
        } else if (accountId) {
            var user = Meteor.users.findOne({_id: accountId});
            if (user) {
                return user.profile.name;
            } else {
                console.log('No user found!');
            }
        }
    },
    dashboard: function() {
        return Router.current().url.indexOf('dashboard') > 0;
    },
    notifications: function() {
    }
});
