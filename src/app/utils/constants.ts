export const ROUTES = {
    LOGIN: '/login',
    HOME: '/',
    PROFILE:{
        MY_PROFILE: '/profile/my-profile',
    },
    COMPANY: {
        LIST: '/companies/list-companies',
        CREATE: '/companies/create-company',
        EDIT: '/companies/edit-company/:uuid',
        DETAILS: '/companies/details/:uuid'
    },
    USER: {
        LIST: '/users/list-users',
        CREATE: '/users/create-user',
        EDIT: '/users/edit-user/:uuid',
        DETAILS: '/users/details/:uuid'
    },
    CAMPAIGN: {
        LIST: '/campaigns/list-campaigns',
        CREATE: '/campaigns/create-campaign',
        EDIT: '/campaigns/edit-campaign/:uuid',
        DETAILS: '/campaigns/details/:uuid'
    },
    ACCESS_DENIED: '/access-denied',

}
