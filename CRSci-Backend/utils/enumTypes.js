const RESOURCE_TYPES = {
    SLIDESHOW:"slideshow", 
    VIDEO:"video", 
    WORKSHEET: "worksheet", 
    QUIZ: "quiz", 
    ASSIGNMENT: "assignment",
    LAB: 'lab',
    STATION: 'station',
    ACTIVITY: 'activity',
    GUIDED_NOTE: 'guided-note',
    FORMATIVE_ASSESSMENT: 'formative-assessment',
    SUMMARIZE_ASSESSMENT: 'summarize-assessment',
    DATA_TRACKER: 'data-tracker'
}

const RESOURCE_STATUS = { 
    SHOW: "show", 
    HIDE: "hide"
}

const CLASSROOM_STATUS = { 
    ACTIVE: "active", 
    INACTIVE: "inactive"
}

const DAILY_UPLOAD_ACTION = {
    CREATE: "create",
    DELETE: "delete",
    UPDATE: "update"
}

module.exports = {RESOURCE_TYPES, RESOURCE_STATUS, CLASSROOM_STATUS, DAILY_UPLOAD_ACTION}