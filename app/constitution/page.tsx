import type { Metadata } from 'next';
import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ScrollText, ArrowLeft } from 'lucide-react';
import { TocAccordion } from '@/features/constitution/TocAccordion';
import { ArticlesAccordion } from '@/features/constitution/ArticlesAccordion';

export const metadata: Metadata = {
  title: 'Constitution — OCA-EU',
  description:
    'The founding constitution of OCA-EU: our governance structure, membership rights, and guiding principles.',
};

const tocData = [
  {
    number: 'I', title: 'Name, Acronym, Logo, and Principal Office',
    sub: ['1.1 Name and Acronym', '1.2 Logo', '1.3 Principal Office and Mailing Address'],
  },
  { number: 'II', title: 'Legal Status', sub: [] },
  {
    number: 'III', title: 'Mission and Purpose',
    sub: ['3.1 Mission', '3.2 Purpose'],
  },
  {
    number: 'IV', title: 'Membership and Registration of Members',
    sub: ['4.1 Membership', '4.2 Registration of members'],
  },
  {
    number: 'V', title: 'Obligations, Rights and Benefits of Members',
    sub: ['5.1 Obligation of members', '5.2 Rights of members', '5.3 Benefits of members'],
  },
  {
    number: 'VI', title: 'Organs and Their Responsibilities',
    sub: [
      '6.1 Organs of the organisation',
      '6.1.1 The general assembly', '6.1.2 The board of directors',
      '6.1.3 The National Executive Management Committee', '6.1.4 The Regional chapters',
      '6.2 Responsibilities of the organs',
      '6.2.1 The General Assembly', '6.2.2 The board of Directors',
      '6.2.3 The National Executive Management Committee', '6.2.4 Regional Chapters',
    ],
  },
  {
    number: 'VII', title: 'Elected Officials and Their Responsibilities',
    sub: [
      '7.1 Elected officials',
      '7.1.1 Board of Directors', '7.1.2 National Executive Management Committee',
      '7.2 Responsibilities of elected officials',
      '7.2.1 Board of Directors',
      '7.2.1.1 Board Chairperson', '7.2.1.2 Vice Board Chairperson',
      '7.2.1.3 Board Secretary', '7.2.1.4 Other officers',
      '7.2.2 National Executive Management Committee',
      '7.2.2.1 National President', '7.2.2.2 National Vice President',
      '7.2.2.3 National Secretary', '7.2.2.4 National Vice Secretary',
      '7.2.2.5 National Treasurer', '7.2.2.6 National Financial Secretary',
      '7.2.2.7 National Public Relations Officer', '7.2.2.8 National Cultural Affairs Coordinator',
    ],
  },
  {
    number: 'VIII', title: 'Elections, Electoral Process and Resignation',
    sub: ['8.1 General Elections', '8.2 Electoral Process', '8.3 Resignation'],
  },
  {
    number: 'IX', title: 'Meetings and Conduct of Meetings',
    sub: [
      '9.1 Meetings',
      '9.1.1 General Assembly Meeting / National Conventions',
      '9.1.2 Board of Directors Meeting',
      '9.1.3 National Executive Management Committee',
      '9.1.4 Regional Chapter Meetings',
      '9.1.5 Adhoc / Emergency Meetings',
      '9.2 Conduct of Meetings',
    ],
  },
  { number: 'X', title: 'Communication with Other Organisations', sub: [] },
  {
    number: 'XI', title: 'Fiscal Year, Financial Resources and Audits',
    sub: [
      '11.1 Fiscal Year',
      '11.2 Source of Funds',
      '11.2.1 Annual Registration Fees', '11.2.2 Fund Raising', '11.2.3 Levies and Donations',
      '11.3 Banking', '11.4 Financial Audit', '11.5 Distribution of Convention Balance',
    ],
  },
  {
    number: 'XII', title: 'Disciplinary Measures',
    sub: ['12.1 Procedure', '12.2 Impeachment', '12.2.3 Suspension / Expulsion', '12.2.4 Regional Chapters'],
  },
  { number: 'XIII', title: 'Amendment of the Constitution', sub: [] },
  {
    number: 'XIV', title: 'Conflict Resolution and Dissolution',
    sub: ['14.1 Conflict Resolutions', '14.2 Dissolution'],
  },
];

type Clause = string | { id: string; text: string; sub?: string[] };
type Article = { number: string; title: string; content: Clause[] };

const articles: Article[] = [
  {
    number: 'I',
    title: 'Name, Acronym, Logo, and Principal Office',
    content: [
      {
        id: '1.1',
        text: 'Name and Acronym — The name of the organisation is "OROKO CULTURAL ASSOCIATION EUROPE (OCA EUROPE)" and shall be referred to by its acronym OCA EU.',
      },
      {
        id: '1.2',
        text: 'Logo — The logo of the organisation shall be represented by the symbol of Etana.',
      },
      {
        id: '1.3',
        text: 'Principal Office and Mailing Address',
        sub: [
          '1.3.1  The head office of the organisation shall be located in Germany.',
          '1.3.2  The mailing address shall be determined by such place.',
          '1.3.3  The organisation may have such other offices as may from time to time as designated by its members.',
        ],
      },
    ],
  },
  {
    number: 'II',
    title: 'Legal Status',
    content: [
      {
        id: '2.1',
        text: 'The organization shall be a non-profit and apolitical organization with the aim of promoting, socio cultural and economic development of the Oroko culture, and development in Oroko areas in Cameroon. It also aims at protecting and catering for the interest of its members within its European branches.',
      },
    ],
  },
  {
    number: 'III',
    title: 'Mission and Purpose',
    content: [
      {
        id: '3.1',
        text: 'The mission of the organization shall be to "Empower, promote, and preserve Oroko culture, language and development in Europe and the Oroko regions in Cameroon".',
      },
      {
        id: '3.2',
        text: 'Purpose — The organisation is created with the following purpose:',
        sub: [
          '1.  Unites all who consider themselves to be indigenes of the Oroko land, having at least one parent or spouse of Oroko origin.',
          '2.  Maintain a unique cultural identity amongst our various clans in order to establish a platform of trust and confidence necessary for the achievements of our goals with a strong common interest.',
          '3.  Promote education, economic and cultural development of Oroko people in Europe and in Cameroon.',
          '4.  Enhance our cultural image through public relations and the dissemination of information.',
          '5.  Aggressively promote education and economic development for the Oroko people in the EU, UK, Cameroon and Africa as a whole.',
        ],
      },
    ],
  },
  {
    number: 'IV',
    title: 'Membership and Registration of Members',
    content: [
      {
        id: '4.1',
        text: 'Membership',
        sub: [
          'a.  To be a member of the Oroko Cultural Association Europe you must be a registered member of one of the local chapters in Europe. Only registered members in regional chapters shall be part of the Oroko Cultural Association Europe.',
          'b.  To constitute a viable regional chapter, there shall be a minimum of 5 registered members. Where members in a region are unable to attain this quota of 5, they are advised to join any constituted chapter of their choice.',
          'c.  The General Assembly of each regional chapter shall determine its elected or nominated officials to the National Executive Council.',
          'd.  The general assembly shall elect the officials to run the affairs of OCA EU.',
        ],
      },
      {
        id: '4.2',
        text: 'Registration of Members',
        sub: [
          '4.2.1  Each member shall pay an annual registration fee of (€10) in their local currency. This amount shall be paid through their regional chapter to the national treasurer.',
          '4.2.2  Each regional chapter shall pay an annual fee of (€100) to the national treasurer. It shall be paid within 6 months of every calendar year.',
          '4.2.3  Each regional chapter shall provide the national office with a list of her registered members within the first 4 months of the year.',
          '4.2.4  The National Executive of OCA EU shall determine when and how meetings are held.',
        ],
      },
    ],
  },
  {
    number: 'V',
    title: 'Obligations, Rights and Benefits of Members',
    content: [
      {
        id: '5.1',
        text: 'Obligations — All registered members of the organisation shall be expected to abide to the following:',
        sub: [
          'a.  Maintain and uphold the image of the organisation.',
          'b.  Protect and defend the interest of the organisation and the Oroko ethnic group.',
          'c.  Pay their annual registration fee.',
          'd.  No member is authorized to solicit funds or issue statements on behalf of the organization except the National Executive Committee of OCA EU.',
          'e.  No individual or group of members pledge the support of the organization to any political party or movement.',
          'f.  Members are expected to complete their registration within the first quarter of the year.',
        ],
      },
      {
        id: '5.2',
        text: 'Rights of Members',
        sub: [
          'a.  Every registered member has the right to vote and to be voted on the Executive Committee.',
          'b.  Only members with good financial and moral standing from their chapters shall be allowed to constitute part of the OCA Europe Executive Committee.',
        ],
      },
      {
        id: '5.3',
        text: 'Bereavement',
        sub: [
          '5.3.1  In an instance where an active member from a chapter and par excellence an active member of OCA Europe dies, O.C.A. EU shall raise the sum of 7000 Euros to be handed to the family of the deceased.',
          '5.3.2  The 7000 Euros shall be generated from contributions made by EU registered members.',
          '5.3.3  It shall be the responsibility of Branches to collect the contribution of their registered members and forward it to the chapter that has suffered the bereavement.',
          '5.3.4  To raise the 7000 euros, this amount will be divided by the total number of registered members.',
          '5.3.5  A date line shall be given within which all branches shall submit their contribution to the group affected.',
          '5.3.6  Where a group has inactive members, they must report to the EU exco so that the total number of their registered members is updated.',
          '5.3.7  Where a branch presents their own contribution at a date later than the date stipulated by the EU exco in conjunction with the affected branch, a fine of 500 Euros shall be implemented.',
        ],
      },
    ],
  },
  {
    number: 'VI',
    title: 'Organs and Their Responsibilities',
    content: [
      {
        id: '6.1',
        text: 'Organs of the Organisation — The organization shall consist of the following structures or organs: The General Assembly, The National Executive Committee.',
      },
      {
        id: '6.1.1',
        text: 'The General Assembly — The general assembly shall consist of the assembly of existing regional chapters and all the categories of membership. It shall be the supreme organ of the organization. Only registered members at their regional chapters are allowed to participate in the deliberations at the general assembly of OCA EU.',
      },
      {
        id: '6.1.3',
        text: 'The National Executive Committee',
        sub: [
          'a.  The national executive management Committee shall comprise of the following officers: President, Secretary General, Financial Secretary, Treasurer, Public Relations Officer and Cultural Affairs Coordinator.',
          'b.  Members of the exco committee shall have a two (2) year mandate. They can be re-elected for a maximum term of two years in the same position.',
          'c.  A member of the exco committee can resign from office at any time provided the president or exco committee accepts his resignation.',
        ],
      },
      {
        id: '6.2',
        text: 'Responsibilities of the Organs',
      },
      {
        id: '6.2.1',
        text: 'The General Assembly shall:',
        sub: [
          'a.  Examine and seek solutions for issues that may affect the proper functioning of the organization.',
          'b.  Study, deliberate and adopt action plans submitted to it by the Executive Committee.',
          'c.  Adopt the budget and finances of the organization.',
          'd.  Has the power to impeach and to pass a vote of no confidence where members of the executive committee are found incompetent to run the affairs of the organization.',
        ],
      },
      {
        id: '6.2.2',
        text: 'The National Executive Committee shall:',
        sub: [
          'a.  Be responsible for the daily management of the organization in strict compliance with the constitution and bye laws of the organization.',
          'b.  Oversee the execution of agreed action plans and projects assigned to the committee by the General Assembly.',
          'c.  Develop and submit its plan of action and budget to the GA for evaluation.',
          'd.  Convening regular quarterly General Assembly meetings.',
        ],
      },
      {
        id: '6.2.4',
        text: 'The Regional Chapters shall:',
        sub: [
          'a.  Raise funds using methods the chapter finds appropriate and in line with the National Constitution and Bye laws.',
          'b.  Assist in collecting national annual registration fee of ten (€10) per member or equivalent per member and channel these to the national Treasurer on or before the 31st March annually. This amount is non-refundable.',
          'c.  Determine their regional membership dues.',
          'd.  Work in collaboration with the national executive committee in accomplishing the mission and purpose of the organization.',
        ],
      },
    ],
  },
  {
    number: 'VII',
    title: 'Elected Officials and Their Responsibilities',
    content: [
      {
        id: '7.1',
        text: 'Elected Officials',
      },
      {
        id: '7.1.2',
        text: 'The National Executive Committee — The national executive committee shall comprise of the following officers: The EU National President, the National Secretary, the National Financial Secretary, the National Treasurer, the Public Relations Officer, the Cultural Affairs Coordinator.',
      },
      {
        id: '7.2',
        text: 'Responsibilities of Elected Officers',
      },
      {
        id: '7.2.1.1',
        text: 'The President shall — The post of president shall be held only by persons with one or all of their parents hailing from Oroko land. Those whose membership is by virtue of marriage can hold any other executive positions in Oroko EU but shall be exempted from running for the post of President. The President\'s functions are to:',
        sub: [
          'a.  Supervise the daily affairs of the organization.',
          'b.  Preside over all National Executive Committee meetings ensuring that peace and orderliness is maintained and the agenda covered well within the time allocated for such meetings.',
          'c.  Convene emergency National Executive meetings if there is an overwhelming need to do so by members.',
          'd.  Help coordinate preparations for the annual national convention with the host regional chapter.',
          'e.  Sign all significant decisions, resolutions and declarations of the National Executive Committee.',
          'f.  Work in collaboration with organizations to negotiate assistance from Government agencies, business entities, charities and foreign donors to foster the activities and agenda of the organization.',
          'g.  Delegate authority to other National Executive Committee members as he or she sees fit.',
          'h.  Approve all expenses by the National Executive Committee after careful deliberations with the GA.',
          'j.  Sign and authorize budgetary expenditures approved by the General Assembly.',
          'k.  Be fair, honest and impartial in resolving members\' conflict. Must be approachable and humble in dealing with members and be proactive in directing the affairs of the organization.',
          'l.  Perform all duties in line with the laws and regulations applicable in the European Union depending on the jurisdiction of the presiding National President.',
        ],
      },
      {
        id: '7.2.1.2',
        text: 'The Vice President — The Vice President shall by delegation or in the absence of the President, deputize for the President.',
      },
      {
        id: '7.2.1.3',
        text: 'The National Secretary General shall:',
        sub: [
          'a.  Prepare, keep and if necessary disseminate records amongst members.',
          'b.  Take and develop minutes of all National Executive Committee and General Assembly meetings.',
          'c.  Carry out general correspondence for the organization, keep records of meetings and have them approved at the next meeting. The Secretary shall seek the approval of the National President before dispatch of any correspondences.',
          'd.  Affix and attest the seal of the organization to all official documents as authorized by the National President.',
          'e.  Prepare relevant and significant documents for the organization for study and ratification.',
          'f.  Prepare annual reports and annual draft budget in consultation with the National exco.',
          'h.  In collaboration with the exco committee and Council, produce the organization\'s newsletter and brochure, and update the directory of its members.',
          'i.  Work in collaboration with the National exco and GA to report all ongoing development projects and other issues that need publicity.',
        ],
      },
      {
        id: '7.2.1.4',
        text: 'Vice Secretary General — The Vice Secretary General shall by delegation or in the absence of the Secretary General, deputize for the Secretary General.',
      },
      {
        id: '7.2.1.5',
        text: 'The National Treasurer shall:',
        sub: [
          'a.  Collect and keep all organization\'s funds and provide financial report quarterly.',
          'b.  Be responsible for paying all the organization\'s financial obligations with the approval of the General Assembly and/or the national Exco as the situation shall warrant.',
          'c.  Participate in fundraising and financial activities of the organization.',
          'd.  Work closely with the National Executive Committee and the General Assembly to devise ways to raise funds and use them more prudently.',
        ],
      },
      {
        id: '7.2.1.6',
        text: 'The National Financial Secretary shall:',
        sub: [
          'a.  Make a record of all financial transactions, collected dues and levies, registration fees and donations. Copies of such records shall be presented to the GA in the next quarterly meeting.',
          'b.  Work in collaboration with the national Treasurer and Executive Committee to prepare annual financial report and draft budget.',
          'c.  Participate in fundraising and financial activities of the organization.',
          'd.  Immediately report financial mismanagement and misappropriation to the General Assembly.',
        ],
      },
      {
        id: '7.2.1.7',
        text: 'The National Public Relations Officer shall:',
        sub: [
          'a.  Be the spokesperson and/or communications officer of the organization.',
          'b.  Be in charge of general protocol.',
          'c.  Be responsible for publicity and information gathering for all matters approved by the Exco Committee and the General Assembly.',
          'd.  Assist the organization with venue selection, planning and hiring in collaboration with the Executive Committee.',
          'e.  Maintain order and discipline on all Oroko EU social media forums, within strict guidelines as stipulated in the byelaws.',
          'f.  In collaboration with the National President, play the role of an administrator to manage and supervise the WhatsApp, Zoom or Microsoft Teams platforms.',
          'g.  Any decision taken by the National PRO in relation to fines or suspension shall be examined by the exco committee in line with the constitution before implementation.',
        ],
      },
      {
        id: '7.2.1.8',
        text: 'The National Cultural Affairs Coordinator shall:',
        sub: [
          'a.  Be vested with the tradition and culture of the Oroko Clan.',
          'b.  Arrange and organize cultural and choral group events during the national conventions for public display.',
          'c.  Initiate and promote events and activities promoting the language and culture amongst Oroko children in diaspora and the wider European community.',
          'd.  Work in collaboration with the Public Relations Officer and National President in accomplishing the tasks in hand.',
        ],
      },
      {
        id: '7.2.1.9',
        text: 'The Project Coordinator shall:',
        sub: [
          'a.  In collaboration with the General Assembly, identify project requirements for Oroko EU.',
          'b.  Identify what projects need to be carried out.',
          'c.  Collaborate with the General Assembly to determine location of projects.',
          'd.  Give periodic reports to the EU exco and General Assembly on project progress and/or hurdles.',
        ],
      },
    ],
  },
  {
    number: 'VIII',
    title: 'Elections, Electoral Process and Resignation',
    content: [
      {
        id: '8.1',
        text: 'General Elections — Each branch shall elect two delegates that will take part in elections to give each branch equal opportunity during elections.',
        sub: [
          'a.  Elections shall be by secret ballot to preserve the identity of the voter.',
          'b.  Voting by proxy is prohibited. Everyone voting must be physically present when casting their votes.',
          'c.  In each round, delegates shall vote for only one candidate for any office. Any nominated candidate who wishes to decline must indicate before the elections.',
          'd.  Any candidate with a simple majority of votes cast shall be elected into office.',
          'f.  By-elections shall be held during a General Assembly Meeting or National Conventions Meetings in case of a vacancy.',
          'g.  Members shall have a two-year (2) years term and a two-year (2) mandate. After the expiration of the second mandate, they can\'t stand in the same position.',
          'h.  Each group/branch shall hold a position in the exco to ensure complete representation.',
        ],
      },
      {
        id: '8.2',
        text: 'Electoral Process',
        sub: [
          'a.  Prior to the elections, the General Assembly shall elect or appoint an electoral committee to conduct and facilitate the elections. The Committee shall lay down the groundwork of conducting the elections. It shall review all candidates against the eligibility criteria as stated in the by-laws.',
          'b.  The electoral committee shall comprise of 4 members and none of the members shall be a candidate for any of the offices for election in question.',
          'c.  Before the elections take place, the current National Executive Committee shall be dissolved by the General Assembly Meeting during the election year.',
          'd.  Only registered members in Good Standing and Character as presented by their regional Chapters shall be allowed to stand for elections at the National Executive Committee.',
          'e.  The names of a maximum of two (2) delegates shall be forwarded to the electoral committee by each branch prior to the commencement of elections.',
          'f.  The electoral Committee shall be dissolved immediately after the announcement of the results of the elections.',
        ],
      },
      {
        id: '8.3',
        text: 'Resignation',
        sub: [
          'a.  An elected member of the National Executive Council may resign at any time.',
          'b.  A snap election shall be conducted within one month from the date of notice to replace the vacancy.',
          'c.  The resignation of a regional chapter president must be communicated to the National Executive Committee within 14 days following the event. The regional chapter is expected to conduct a snap election to replace the chapter president within one month from the date of the notice to resign.',
        ],
      },
    ],
  },
  {
    number: 'IX',
    title: 'Meetings and Conduct of Meetings',
    content: [
      {
        id: '9.1',
        text: 'Meetings',
      },
      {
        id: '9.1.1',
        text: 'General Assembly Meetings / National Conventions',
        sub: [
          'a.  The General Assembly shall meet (3) times a year. The first general assembly meeting shall take place in the month of April, dedicated to planning for the year, collection of annual membership fees, updating membership list, reviewing of previous convention and planning for the annual Convention.',
          'b.  The second General Assembly meeting shall be a physical meeting coinciding with the annual convention. The national executive committee can schedule other meetings prior to the national convention. The next host country shall be confirmed through a Rota system unanimously agreed by the general assembly.',
          'c.  The third general assembly meeting shall be a virtual meeting to update members of the activities throughout the year. The National Financial Secretary and the National President shall update the General Assembly of the financial health of the association. This meeting shall be an end of year General Assembly Meeting dedicated to audit reports, financial reports and a general overview of the health of OCA EU.',
          'd.  Funding of the annual convention: The funding of the annual convention shall be jointly funded by all regional chapter members of OCA EU. Each chapter member is expected to pay the sum of €100 to organize the national convention.',
          'i.  Every regional chapter is expected to make a contribution of €100 to the National Treasurer on or before the 30th June.',
          'e.  Failure to comply with article 9.1.d shall incur a fine.',
          'f.  Where the host country incurs additional cost which was supposed to be borne by OCA EU, the organization shall reimburse the host country upon production of a valid receipt. The National Treasurer is obliged to make payment within 14 days upon production of a valid receipt.',
          'g.  Profits generated after all expenses are deducted shall go into the coffers of the National treasury. The host may have a minority share of the profits depending on the outcome of the event.',
          'h.  In the event of an emergency, the national president shall convene a virtual extraordinary general assembly meeting to seek the opinion of members. The decision taken must be of the best interest of the organization.',
          'i.  Guest Speakers: Where the organization decides to invite a guest speaker, he/she must come from within the Oroko tribe except the organization decides otherwise. They should be role models based on their contributions to our communities. The National Executive Committee shall inform the General Assembly of who the guest speakers are and the topic of discussion.',
        ],
      },
      {
        id: '9.1.2',
        text: 'National Executive Committee Meetings',
        sub: [
          'a.  Members of the National Executive Committee shall convene meetings as they deem necessary using any channel or means they find convenient e.g. teleconference including Zoom, Microsoft Teams, WhatsApp etc.',
          'b.  These meetings shall be chaired by the National President or a delegated official.',
          'c.  Decisions reached during these meetings shall be final and binding if adopted by a majority of members of the General Assembly.',
        ],
      },
      {
        id: '9.1.4',
        text: 'Chapter Meetings — The chapters shall determine the frequency and hosting of their meetings.',
      },
      {
        id: '9.1.5',
        text: 'Ad Hoc / Emergency Meetings',
        sub: [
          'a.  The National President shall call Ad Hoc meetings whenever need arises.',
          'b.  Such a meeting shall be hosted in any chosen venue offering the least expenditure or through teleconference.',
        ],
      },
      {
        id: '9.2',
        text: 'Conduct of Meetings',
        sub: [
          'Before any General Assembly meeting decision becomes binding on members, a quorum of a minimum of 20% of the total number of registered members in the EU must be present during meetings.',
          'For any Exco decision to be meaningful, at least 4 out of the 7 executive officers including the National President must be present in that meeting. Where fewer than 4 executive officers are present, any decision taken is invalid and void.',
        ],
      },
    ],
  },
  {
    number: 'X',
    title: 'Communication',
    content: [
      {
        id: '10.1',
        text: 'Considering the regional structure and composition of the group, communication can be realized through virtual or physical means.',
      },
      {
        id: '10.1.2',
        text: 'The organization shall subscribe annually for a Zoom or Microsoft Teams platform to host meetings virtually. A member can voluntarily opt to support the organization in paying for the annual license.',
      },
      {
        id: '10.1.3',
        text: 'The organization shall operate three distinct WhatsApp platforms only:',
        sub: [
          'Oroko EU Members Forum — This forum shall be strictly dedicated to matters related to the growth of Oroko EU, matters relating to registered members, and matters relating to regional chapters. The publicity secretary and the National President shall be the only two officers with administration rights. Any violation shall incur a fine of €10 for the first breach; doubled to €20 for a second breach in the same year; and an automatic 3-month suspension for a third breach. Where a member refuses to pay a legitimate fine, that member will be immediately suspended indefinitely from the organization.',
          'Oroko EU General Forum — This forum shall be dedicated to social, cultural, political and other human interest stories. Graphic images of a sexual nature are forbidden. Where graphic images other than sexual images are shared, the sender must include a warning sign "Viewers discretion is required". Failure to do this will lead to a warning from the publicity secretary. Repeated violation will lead to a fine and subsequent suspension. The publicity secretary and the National President shall be the only two officers with administration rights.',
          'Oroko EU Executive Forum — This forum shall consist only of members of the national executive committee. All nine executive officers shall have administration rights. At the end of an executive term or the resignation or removal from office of a member of the national executive, their entitlement of administrative rights will be terminated.',
        ],
      },
      {
        id: '10.1.4',
        text: 'The Cultural Secretary in collaboration with the President shall endeavour to maintain order and discipline in the Oroko EU Members\' Forum.',
      },
      {
        id: '10.1.5',
        text: 'Where a member single-handedly creates a forum depicting Oroko EU without consulting the National Executive Committee or General Assembly, that member shall be fined and the platform taken down immediately.',
      },
      {
        id: '10.1.6',
        text: 'The organization shall maintain a cordial relationship with relevant organizations within Europe as well as sister organizations in other parts of the world.',
      },
    ],
  },
  {
    number: 'XI',
    title: 'Fiscal Year, Financial Resources and Audits',
    content: [
      {
        id: '11.1',
        text: 'Fiscal Year — The fiscal year of the organization shall be the calendar year, from January 1st to December 31st.',
      },
      {
        id: '11.2',
        text: 'Source of Funds — The association shall derive its funds from:',
        sub: [
          'I.   Membership annual registration fees and convention fee.',
          '1.  Fund raising activities.',
          '2.  Levies, donations, pledges, fines, grants, and subsidies.',
        ],
      },
      {
        id: '11.3',
        text: 'Annual Registration Fees',
        sub: [
          '1.  Individual members shall pay an annual registration and convention fee of €75 on or before June of every calendar year. The amount shall be paid through the regional chapter. Members shall be given free food on Friday but would be responsible for their feeding during the rest of the convention.',
          '2.  Only members who have paid their registration will be entitled to any voluntary contributions at the national level.',
          '3.  Each regional chapter shall pay an annual registration fee of €100 to the national treasurer.',
        ],
      },
      {
        id: '11.4',
        text: 'Fund-Raising',
        sub: [
          'A.  The organization shall raise funds through special events including but not limited to fund-raisers, convention fees, annual dues, galas, donations, contributions, levies, pledges, grants and fines.',
          'B.  Other strategies to raise funds shall be encouraged and all fund-raising suggestions must be analyzed to ensure that they are profitable.',
        ],
      },
      {
        id: '11.5',
        text: 'Levies and Donations',
        sub: [
          'a.  There shall be levies and donations from time to time as projects may arise.',
          'b.  The nature and amount of the levy and/or donation shall be determined by the general assembly.',
        ],
      },
      {
        id: '11.6',
        text: 'Banking',
        sub: [
          'a.  An account shall be opened in a bank within Europe in the name of the organization.',
          'b.  The organization\'s funds shall be deposited in the bank at most three (3) working days following the day wherein the funds are collected or received.',
          'c.  There must be at least three authorized signatures in the account: National President, National Treasurer and National Financial Secretary.',
          'd.  All three signatories shall be allowed to monitor bank transactions and to report inappropriate activities.',
        ],
      },
      {
        id: '11.7',
        text: 'Financial Audit',
        sub: [
          'a.  A statement of account shall be presented during the general assembly meeting/convention by the Financial Secretary.',
          'b.  A comprehensive audit shall be conducted at the end of each year.',
          'c.  Three (3) members shall be nominated by the general assembly during the convention for the audit.',
          'd.  The board shall have no influence on the auditors.',
          'f.  The auditors\' tenure shall terminate in accordance with the mandate given by the General Assembly.',
        ],
      },
      {
        id: '11.8',
        text: 'Distribution of Convention Balance',
        sub: [
          '11.8.1  The balance at the end of every national convention shall be deposited into the accounts of the national treasury after reimbursing the expenses of the regional chapters and the host country.',
          '11.8.2  The host country may be entitled to a fraction of the balance depending on the circumstances and the agreement of the national exco.',
        ],
      },
    ],
  },
  {
    number: 'XII',
    title: 'Disciplinary Measures',
    content: [
      {
        id: '12.1',
        text: 'Procedure',
        sub: [
          'a.  A motion to impeach the president or a member of the Exco committee may be triggered by a registered and active member by tabling his/her allegations to the general assembly for investigation.',
          'b.  For the motion to be valid, the agreement of two other members is required.',
          'c.  Where two other members support this motion, the general assembly shall proceed to take a vote of No Confidence.',
          'd.  In order to impeach an officer of the national exco, a simple majority of members present is required. Where an officer of the national exco is impeached, they shall cease to execute their functions with immediate effect and any documents belonging to the association must be handed over within 48 hours.',
        ],
      },
      {
        id: '12.2',
        text: 'Impeachment — An exco member may be impeached for one or more of the following offences: embezzlement, fraud, and misrepresentation of the corporation, betrayal of trust, theft and deviating from the corporation\'s Mission Statement.',
      },
      {
        id: '12.3',
        text: 'Suspension / Expulsion',
        sub: [
          'a.  Exco members or elected officials found guilty after impeachment shall be dismissed/expelled with immediate effect, by an affirmative vote of the majority members of the general assembly, if the members consider such dismissal to be in the best interests of the Association.',
          'b.  Any Exco official who fails to attend two board meetings without any tangible excuse shall automatically be expelled from the board.',
        ],
      },
    ],
  },
  {
    number: 'XIII',
    title: 'Amendment of the Constitution',
    content: [
      {
        id: '13.1',
        text: 'This constitution or article of the constitution is subject to amendments at least once a year during the general assembly meeting or national convention as the situation warrants, in accordance with the following provisions:',
        sub: [
          'a.  Any proposed amendment(s) shall be submitted to the Board President at least six (6) months before the general meeting/convention, wherein it shall be motioned.',
          'b.  The motion shall be debated in the general meeting/convention and the decision reached shall be voted upon.',
          'c.  A constitutional review committee shall be appointed to oversee the amendment process.',
        ],
      },
      {
        id: '13.2',
        text: 'Amendments to this constitution shall require a two-third (2/3) majority vote of registered members present during a general assembly meeting of the corporation.',
      },
      {
        id: '13.3',
        text: 'All resolutions of the general assembly amending the constitution shall upon adoption become effective and enforceable immediately.',
      },
    ],
  },
  {
    number: 'XIV',
    title: 'Conflict Resolution',
    content: [
      {
        id: '14.1',
        text: 'Conflict Resolution',
        sub: [
          'a.  Conflicts within the organization shall be resolved by arbitration.',
          'b.  If all arbitration efforts fail, the organization shall take further measures that will include law enforcement.',
        ],
      },
    ],
  },
];

export default function ConstitutionPage() {
  return (
    <main>
      {/* Hero */}
      <Section className="bg-stone-950 text-white pt-20 md:pt-20" tight>
        <div className="max-w-3xl py-12">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-amber-400 text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to About
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ScrollText className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-amber-400 text-sm font-medium uppercase tracking-widest">
              Guiding Document
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Constitution of OCA-EU
          </h1>
          <p className="text-stone-300 text-lg leading-relaxed">
            The guiding constitution of the Oroko Cultural Association Europe — defining our values, governance, membership rights, and shared purpose across all branches.
          </p>
        </div>
      </Section>

      {/* Preamble */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <div className="border-l-4 border-amber-500 pl-6 py-2 mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-4">
              Preamble
            </p>
            <ul className="space-y-3 mb-5">
              {[
                'Fully aware of our common origin as a people from the Oroko ethnic group in Cameroon,',
                'Considering that we are in Europe,',
                'Considering our community spirit of togetherness and love,',
                'Fully aware of how we can make advancement in education, development, culture etc., if we are united,',
              ].map((point) => (
                <li key={point} className="flex gap-3 text-stone-600 text-base leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <p className="text-stone-600 leading-relaxed text-base">
              We the members of the Oroko ethnic group belonging to our local chapters have agreed
              to form a non-profit organisation under the nonprofit charities and Foundations Laws
              in the EU. This constitution shall bind all persons who identify themselves with the
              Oroko cultural association in Europe herein known as <span className="font-semibold text-stone-800">members</span>.
            </p>
          </div>

          {/* Quick-nav */}
          <div className="bg-stone-50 rounded-2xl p-6 mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
              Table of Contents
            </p>
            <TocAccordion tocData={tocData} />
          </div>
        </div>
      </Section>

      {/* Articles */}
      <Section className="bg-stone-50 pt-0">
        <div className="max-w-3xl mx-auto">
          <ArticlesAccordion articles={articles} />
        </div>
      </Section>

      {/* Footer note */}
      <Section tight>
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Members of the Draft Constitutional Review Committee
            </p>
            <ul className="space-y-1">
              {[
                'Tata Malle Felix Ikoe',
                'Patrice Natoa Ikoe',
                'Tata Roland Ekue',
                'Iya Beloe',
                'Tata Ayamba Ashu',
                'Tata Ndingi',
                'Tata Misodi Johannes',
              ].map((name) => (
                <li key={name} className="text-sm text-stone-600">{name}</li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            This document is the official English translation of the OCA-EU Constitution.
            In the event of any discrepancy, the French original shall prevail.
            For queries, contact the Secretary General at{' '}
            <a
              href="mailto:secretary@oca-eu.org"
              className="text-amber-700 hover:underline"
            >
              secretary@oca-eu.org
            </a>
            .
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-medium text-stone-500 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to About
          </Link>
        </div>
      </Section>
    </main>
  );
}
