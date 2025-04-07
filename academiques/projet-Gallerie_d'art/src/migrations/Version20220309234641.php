<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220309234641 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE commande (id INT AUTO_INCREMENT NOT NULL, cin INT NOT NULL, total INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dons (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, num_carte INT NOT NULL, montant NUMERIC(10, 0) NOT NULL, INDEX IDX_E4F955FAA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE finance (id INT AUTO_INCREMENT NOT NULL, dons_id INT DEFAULT NULL, evenement_id INT DEFAULT NULL, commande_id INT DEFAULT NULL, date DATE NOT NULL, somme INT NOT NULL, color1 VARCHAR(7) NOT NULL, color2 VARCHAR(7) NOT NULL, color3 VARCHAR(7) NOT NULL, INDEX IDX_CE28EAE0DDBFD07B (dons_id), INDEX IDX_CE28EAE0FD02F13 (evenement_id), INDEX IDX_CE28EAE082EA2E54 (commande_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE dons ADD CONSTRAINT FK_E4F955FAA76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE finance ADD CONSTRAINT FK_CE28EAE0DDBFD07B FOREIGN KEY (dons_id) REFERENCES dons (id)');
        $this->addSql('ALTER TABLE finance ADD CONSTRAINT FK_CE28EAE0FD02F13 FOREIGN KEY (evenement_id) REFERENCES evenement (id)');
        $this->addSql('ALTER TABLE finance ADD CONSTRAINT FK_CE28EAE082EA2E54 FOREIGN KEY (commande_id) REFERENCES commande (id)');
        $this->addSql('ALTER TABLE evenement ADD CONSTRAINT FK_B26681E6AA2E66A FOREIGN KEY (collaborateur1_id) REFERENCES collaborateur (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE finance DROP FOREIGN KEY FK_CE28EAE082EA2E54');
        $this->addSql('ALTER TABLE finance DROP FOREIGN KEY FK_CE28EAE0DDBFD07B');
        $this->addSql('DROP TABLE commande');
        $this->addSql('DROP TABLE dons');
        $this->addSql('DROP TABLE finance');
        $this->addSql('ALTER TABLE calender CHANGE title title VARCHAR(100) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE description description LONGTEXT NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE background_color background_color VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE border_color border_color VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE text_color text_color VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE collaborateur CHANGE nom_collaborateur nom_collaborateur VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE prenom_collaborateur prenom_collaborateur VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE role role VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE entreprise entreprise VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE emplois CHANGE nom nom VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE prenom prenom VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE evenement DROP FOREIGN KEY FK_B26681E6AA2E66A');
        $this->addSql('ALTER TABLE evenement CHANGE nom_evenement nom_evenement VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE description description VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE qr_code qr_code VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE reclamation CHANGE type type VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE msg msg VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE reponse CHANGE rep rep VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE `user` CHANGE nom nom VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE prenom prenom VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE role role VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE access access VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE image image VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
    }
}
