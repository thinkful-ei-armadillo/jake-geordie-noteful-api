-- psql -U postgres -d noteful -f noteful-api\seeds\seed.noteful.sql

TRUNCATE folders, notes;

INSERT INTO folders ( id, title )
VALUES
('b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1', 'Important'),
('b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1', 'Super'),
('b07162f0-ffaf-11e8-8eb2-f2801f1b9fd1', 'Spangley');

INSERT INTO notes ( id, title, modified, folderId, content )
VALUES
      ('cbc787a0-ffaf-11e8-8eb2-f2801f1b9fd1',
      "Dogs",
      "2019-01-03T00:00:00.000Z",
      "b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1",
      "Corporis accusamus placeat quas non voluptas."), 
      ('d26e0034-ffaf-11e8-8eb2-f2801f1b9fd1',
      "Cats",
      "2018-08-15T23:00:00.000Z",
      "b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1",
      "Eos laudantium quia ab blanditiis temporibus necessitatibus."),
      ('d26e01a6-ffaf-11e8-8eb2-f2801f1b9fd1',
      "Pigs",
      "2018-03-01T00:00:00.000Z",
      "b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1",
      "Occaecati dignissimos quam qui facere deserunt quia."),
      ('d26e0570-ffaf-11e8-8eb2-f2801f1b9fd1',
      "Birds",
      "2019-01-04T00:00:00.000Z",
      "b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1",
      "Eum culpa odit. Veniam porro molestiae dolores sunt reiciendim ex maiores."),
      ('d26e0714-ffaf-11e8-8eb2-f2801f1b9fd1',
      "Bears",
      "2018-07-12T23:00:00.000Z",
      "b0715efe-ffaf-11e8-8eb2-f2801f1b9fd1",
      "Distinctio dolor nihil ad iure quo tempore id ipsum.");
