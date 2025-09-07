// Temporary type definitions to use until Supabase types are properly generated

/**
 * @typedef {Object} ContactSubmission
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} subject
 * @property {string} message
 * @property {string} created_at
 */

/**
 * @typedef {Object} Appointment
 * @property {string} id
 * @property {string} full_name
 * @property {string} email
 * @property {string} phone
 * @property {string} service
 * @property {string} date
 * @property {string} time
 * @property {string|null} notes
 * @property {string} status
 * @property {string} created_at
 */

/**
 * @typedef {Object} Admin
 * @property {string} id
 * @property {string} user_id
 * @property {string|null} name
 * @property {string} created_at
 */

/**
 * @typedef {Object} BlogPost
 * @property {string} id
 * @property {string} title
 * @property {string} meta_description
 * @property {string} slug
 * @property {string} [featured_image]
 * @property {string} [featured_image_alt]
 * @property {string} content
 * @property {string} author
 * @property {string[]} tags
 * @property {boolean} published
 * @property {string} [published_date]
 * @property {string} [schema_markup]
 * @property {string} created_at
 * @property {string} [meta_title]
 * @property {string} [meta_keywords]
 * @property {string} [canonical_url]
 * @property {string} [og_title]
 * @property {string} [og_description]
 * @property {string} [og_image]
 * @property {string} [og_type]
 * @property {string} [twitter_title]
 * @property {string} [twitter_description]
 * @property {string} [twitter_image]
 * @property {string} [twitter_card]
 * @property {string} [excerpt]
 * @property {number} [reading_time]
 * @property {string} [category]
 * @property {string} [status]
 * @property {boolean} [featured]
 * @property {boolean} [allow_comments]
 * @property {string} [scheduled_date]
 * @property {string} [visibility]
 * @property {string} [password]
 * @property {string} [robots_meta]
 * @property {string} [focus_keyword]
 * @property {number} [readability_score]
 * @property {number} [seo_score]
 */

// Export empty objects for runtime compatibility
export const ContactSubmission = {};
export const Appointment = {};
export const Admin = {};
export const BlogPost = {};
