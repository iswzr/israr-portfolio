import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'project',
    title: 'Project',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
        }),
        defineField({
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
            description: "One line summary e.g. 'Multi-tenant clinic SaaS'",
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Power BI / Data', value: 'powerbi' },
                    { title: 'Full-Stack SaaS', value: 'saas' },
                    { title: 'Data Analysis', value: 'analysis' },
                    { title: 'Excel / Reporting', value: 'excel' },
                    { title: 'Other', value: 'other' },
                ],
            },
        }),
        defineField({
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Live', value: 'live' },
                    { title: 'In Progress', value: 'wip' },
                    { title: 'Completed', value: 'completed' },
                ],
            },
        }),
        defineField({
            name: 'featured',
            title: 'Featured Project?',
            type: 'boolean',
            initialValue: false,
        }),
        defineField({
            name: 'cover',
            title: 'Cover Image',
            type: 'image',
            options: { hotspot: true }, // This gives you a built-in UI to crop images!
        }),
        defineField({
            name: 'body',
            title: 'Full Write-up',
            type: 'array',
            of: [{ type: 'block' }], // This is Sanity's ultra-modern rich text editor
        }),
        defineField({
            name: 'live_url',
            title: 'Live URL',
            type: 'url',
        }),
        defineField({
            name: 'github_url',
            title: 'GitHub URL',
            type: 'url',
        }),
        defineField({
            name: 'google_drive_url',
            title: 'Google Drive URL',
            type: 'url',
            description: 'Direct link to a Google Drive folder or document',
        }),
        defineField({
            name: 'resume_file',
            title: 'Resume / Direct Document',
            type: 'file',
            description: 'Upload a PDF resume or standalone document directly',
        }),
    ],
})