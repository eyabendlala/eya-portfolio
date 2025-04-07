<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220310015101 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE reservation (id INT AUTO_INCREMENT NOT NULL, users_id INT DEFAULT NULL, visite_id INT DEFAULT NULL, INDEX IDX_42C8495567B3B43D (users_id), INDEX IDX_42C84955C1C5DC59 (visite_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE visite (id INT AUTO_INCREMENT NOT NULL, evenement_id INT DEFAULT NULL, date DATE NOT NULL, description VARCHAR(255) NOT NULL, disponibilite INT NOT NULL, num_carte INT NOT NULL, montant NUMERIC(10, 0) NOT NULL, sexe VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_B09C8CBBFD02F13 (evenement_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C8495567B3B43D FOREIGN KEY (users_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE reservation ADD CONSTRAINT FK_42C84955C1C5DC59 FOREIGN KEY (visite_id) REFERENCES visite (id)');
        $this->addSql('ALTER TABLE visite ADD CONSTRAINT FK_B09C8CBBFD02F13 FOREIGN KEY (evenement_id) REFERENCES evenement (id)');
        $this->addSql('ALTER TABLE dons CHANGE montant montant INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE reservation DROP FOREIGN KEY FK_42C84955C1C5DC59');
        $this->addSql('DROP TABLE reservation');
        $this->addSql('DROP TABLE visite');
        $this->addSql('ALTER TABLE calender CHANGE title title VARCHAR(100) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE description description LONGTEXT NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE background_color background_color VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE border_color border_color VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE text_color text_color VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE collaborateur CHANGE nom_collaborateur nom_collaborateur VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE prenom_collaborateur prenom_collaborateur VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE role role VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE entreprise entreprise VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE dons CHANGE montant montant NUMERIC(10, 0) NOT NULL');
        $this->addSql('ALTER TABLE emplois CHANGE nom nom VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE prenom prenom VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE evenement CHANGE nom_evenement nom_evenement VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE description description VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE qr_code qr_code VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE finance CHANGE color1 color1 VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE color2 color2 VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE color3 color3 VARCHAR(7) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE reclamation CHANGE type type VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE msg msg VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE reponse CHANGE rep rep VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE `user` CHANGE nom nom VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE prenom prenom VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE role role VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE access access VARCHAR(10) NOT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE image image VARCHAR(255) NOT NULL COLLATE `utf8mb4_unicode_ci`');
    }
}
