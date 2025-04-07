#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "animal.h"
#include"nourriture.h"


namespace Ui {
class MainWindow;
}


class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_pb_ajouter_clicked();

    void on_pb_supprimer_clicked();

    void on_pb_modifier_clicked();

    void on_rechercher_anim_clicked();
    void on_reafficher_anim_clicked();

    void on_reset_clicked();


    void on_stat_clicked();

    void on_pb_ajouter_2_clicked();

    void on_pb_supprimer_2_clicked();

    void on_pb_modifier_2_clicked();

    void on_reset_2_clicked();

    void on_exporter_clicked();

    void on_le_id_supp_textChanged(const QString &arg1);



    void on_le_id_supp_2_textChanged(const QString &arg1);



    //void on_comboBox_2_currentIndexChanged(int index);

    void on_radioButton_type_clicked();

    void on_radioButton_quantite_clicked();

    void on_radioButton_id_clicked();

private:
    Ui::MainWindow *ui;
    Animal A;
    Nourriture N_temp;
};

#endif // MAINWINDOW_H
