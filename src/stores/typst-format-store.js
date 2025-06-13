import { defineStore } from 'pinia'

export const useTypstFormatStore = defineStore('typstFormat', {
  state: () => ({
    typstFormat: `
    #let resume(
      author: "",
      author-position: left,
      personal-info-position: left,
      pronouns: "",
      location: "",
      email: "",
      github: "",
      linkedin: "",
      phone: "",
      personal-site: "",
      orcid: "",
      accent-color: "#26428b",
      heading-color: "#26428b",
      font: "Libertinus Serif",
      paper: "us-letter",
      body,
    ) = {

      // Sets document metadata
      set document(author: author, title: author)

      // Document-wide formatting, including font and margins
      set text(
        // LaTeX style font
        font: font,
        lang: "en",
        // Disable ligatures so ATS systems do not get confused when parsing fonts.
        ligatures: false,
        hyphenate: false
      )

      // Reccomended to have 0.5in margin on all sides
      set page(
        margin: (0.5in),
        paper: paper,
      )

      // Link styles
      show link: underline


      // Small caps for section titles
      show heading.where(level: 2): it => [
        #pad(top: 0pt, bottom: -10pt, [#smallcaps(it.body)])
        #line(length: 100%, stroke: 1pt)
      ]

      // Accent Color Styling
      show heading: set text(
        fill: rgb(heading-color),
      )

      show link: set text(
        fill: rgb(accent-color),
      )

      // Name will be aligned left, bold and big
      show heading.where(level: 1): it => [
        #set align(author-position)
        #set text(
          weight: 700,
          size: 16pt,
        )
        #pad(it.body)
      ]

      // Level 1 Heading
      [= #(author)]

      // Personal Info Helper
      let contact-item(value, link-type: "") = {
        if value != "" {
          if link-type != "" and link-type != email {
            link("https://" + value)[#(link-type)]
          } else {
            value
          }
        }
      }

      // Personal Info
      pad(
        top: 0.25em,
        align(personal-info-position)[
          #{
            let items = (
              contact-item(pronouns),
              contact-item(phone),
              contact-item(location),
              contact-item(email, link-type: email),
              contact-item(github, link-type: "Github"),
              contact-item(linkedin, link-type: "LinkedIn"),
              contact-item(personal-site, link-type: "Website"),
            )
            items.filter(x => x != none).join("  |  ")
          }
        ],
      )

      // Main body.
      set par(justify: true)

      body
    }

    // Generic two by two component for resume
    #let generic-two-by-two(
      top-left: "",
      top-right: "",
      bottom-left: "",
      bottom-right: "",
    ) = {
      [
        #top-left #h(1fr) #top-right \\ #bottom-left #h(1fr) #bottom-right
      ]
    }

    // Generic one by two component for resume
    #let generic-one-by-two(
      left: "",
      right: "",
    ) = {
      [
        #left #h(1fr) #right
      ]
    }

    // Cannot just use normal --- ligature because ligatures are disabled for good reasons
    #let dates-helper(
      start-date: "",
      end-date: "",
    ) = {
      if start-date == "" and end-date != "" {
        end-date  // Only show end-date if start-date is missing
      } else if start-date != "" and end-date != "" {
        start-date + " " + $dash.em$ + " " + end-date  // Show both dates if both are present
      } else {
        start-date  // Show start-date if only start-date is present
      }
    }

    // Section components below
    #let edu(
      institution: "",
      dates: "",
      degree: "",
      gpa: "",
      location: "",
    ) = {
      generic-two-by-two(
        top-left: strong(institution),
        top-right: strong(dates),
        bottom-left: emph(degree),
        bottom-right: emph(location),
      )
    }

    // Use edu-constant to standardize the location and dates of education and work experience
    #let edu-constant(
      institution: "",
      dates: "",
      degree: "",
      gpa: "",
      location: "",
    ) = {
      generic-two-by-two(
        top-left: strong(institution),
        top-right: dates,
        bottom-left: emph(degree),
        bottom-right: emph(location),
      )
    }

    #let work(
      title: "",
      dates: "",
      company: "",
      location: "",
    ) = {
      generic-two-by-two(
        top-left: strong(company),
        top-right: strong(dates),
        bottom-left: title,
        bottom-right: emph(location),
      )
    }

    #let project(
      role: "",
      name: "",
      url: "",
      dates: "",
    ) = {
      generic-one-by-two(
        left: {
          if role == "" {
            [*#name* #if url != "" and dates != "" [ (#link("https://" + url)[#url])]]
          } else {
            [*#role*, #name #if url != "" and dates != ""  [ (#link("https://" + url)[#url])]]
          }
        },
        right: {
          if dates == "" and url != "" {
            link("https://" + url)[#url]
          } else {
            strong(dates)
          }
        },
      )
    }

    #let certificates(
      name: "",
      issuer: "",
      url: "",
      date: "",
    ) = {
      [
        *#name*, #issuer
        #if url != "" {
          [ (#link("https://" + url)[#url])]
        }
        #h(1fr) #date
      ]
    }

    #let extracurriculars(
      activity: "",
      dates: "",
    ) = {
      generic-one-by-two(
        left: strong(activity),
        right: dates,
      )
    }
    `,
  }),

  getters: {
    getTypstFormat: (state) => state.typstFormat.trim(),
  },
})
