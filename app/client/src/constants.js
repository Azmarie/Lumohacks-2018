angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'Lumohacks 2018',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: 'You should have received an email asking you verify your email. Click the link in the email and you can start your application!',
        INCOMPLETE_TITLE: 'You still need to complete your application!',
        INCOMPLETE: ' Seats are filling fast! If you haven\'t already, submit your application as soon as possible to secure a spot. Please be sure to check your spam and junk folders if you don’t hear from us in a month, and add contact@designlablive.com to your safe list.',
        SUBMITTED_TITLE: 'Acceptances are sent on a rolling basis, so please confirm your attendance as soon as possible to secure your seat, or else it may be passed to someone else. Please be sure to check your spam and junk folders if you don’t hear from us in a month, and add contact@designlablive.com to your safe list.',
        SUBMITTED: 'Feel free to edit it at any time. However, once registration is closed, you will not be able to edit it any further.\nAdmissions will be competitive, please provide us with enough information to showcase your skillset before registration is closed!',
        CLOSED_AND_INCOMPLETE_TITLE: 'Unfortunately, registration has closed, and the lottery process has begun.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, you will not be eligible for the lottery process.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: 'Please make sure to confirm within a week of acceptance to secure your seat, or else it may be passed to someone else. Check your spam and junk folders if you don’t hear from us in a month, and add contact@designlablive.com to your safe list.',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: 'Your confirmation deadline of [CONFIRM_DEADLINE] has passed.',
        ADMITTED_AND_CANNOT_CONFIRM: 'Although you were accepted, you did not complete your confirmation in time.\nUnfortunately, this means that you will not be able to attend the event, as we must begin to accept other applicants on the waitlist.\nWe hope to see you again next year!',
        CONFIRMED_NOT_PAST_TITLE: 'You can edit your confirmation information until [CONFIRM_DEADLINE]',
        DECLINED: 'We\'re sorry to hear that you won\'t be able to make it to Lumohacks 2018! :(\nMaybe next year! We hope you see you again soon.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the lottery with a team.\nHowever, you can still form teams on your own before or during the event!',
    });
