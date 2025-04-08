#ifndef STATI_H
#define STATI_H
#include<QtCharts>
#include<QChartView>
#include<QPieSeries>
#include<QPieSlice>
#include <QWidget>

namespace Ui {
class stati;
}

class stati : public QWidget
{
    Q_OBJECT

public:
    explicit stati(QWidget *parent = nullptr);
    void make();
    ~stati();

private:
    Ui::stati *ui;
};

#endif // STATI_H
