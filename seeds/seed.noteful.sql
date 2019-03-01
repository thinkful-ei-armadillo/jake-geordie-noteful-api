-- psql -U postgres -d noteful -f seeds/seed.noteful.sql

TRUNCATE folders, notes;

INSERT INTO folders ( id, title )
VALUES
(1, 'Important'),
(2, 'Super'),
(3, 'Spangley');

INSERT INTO notes ( id, title, modified, folderId, content )
VALUES
      (5, 'Dogs', '2019-01-03T00:00:00.000Z', 1, 'Corporis accusamus placeat quas non voluptas.'), 
      (6, 'Cats', '2018-08-15T23:00:00.000Z', 2, 'Eos laudantium quia ab blanditiis temporibus necessitatibus.'),
      (7, 'Pigs', '2018-03-01T00:00:00.000Z', 2, 'Occaecati dignissimos quam qui facere deserunt quia.'),
      (8, 'Birds', '2019-01-04T00:00:00.000Z', 1, 'Eum culpa odit. Veniam porro molestiae dolores sunt reiciendim ex maiores.'),
      (9, 'Bears', '2018-07-12T23:00:00.000Z', 1, 'Distinctio dolor nihil ad iure quo tempore id ipsum.');
