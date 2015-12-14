Template.navigation.helpers({
    'devices': function() {
        return Devices.find({accountId: Meteor.user()._id, deleted: { $ne: true }});
    },
    'isActiveDynamicPath': function(params) {
        return Iron.Location.get('path').path == ('/'+params.hash.url +'/'+params.hash.param) ? 'active': '';
    }
});

Template.navigation.rendered = function(){
    // Initialize metisMenu
    $('#side-menu').metisMenu();
};

// Used only on OffCanvas layout
Template.navigation.events({
    'click .close-canvas-menu' : function(){
        $('body').toggleClass("mini-navbar");
    }
});
