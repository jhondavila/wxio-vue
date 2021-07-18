
export default {

    pivot(data) {
        var row = function (d) {
            return {
                id: d["date"],
                groups: [d["date"]]
            };
        };

        var col = function (d) {
            return {
                id: `${d["gender"]}`,
                groups: [d["gender"]]
            };
        };

        var aggr = function (ds) {
            var val = _.default(ds).reduceRight(
                function (a, b) {
                    return {
                        total: parseInt(a.total) + parseInt(b.total)
                    };
                },
                { total: 0 }
            );
            return val.total;
        };

        var rows = _.chain(data)
            .map(row)
            .uniqBy("id")
            .value();
        var columns = _.chain(data)
            .map(col)
            .uniqBy("id")
            .value();

        columns = _.orderBy(
            columns,
            i => {
                return `${i.groups[0]}`;
            },
            ["asc"]
        );

        // rows = [];
        columns = [];

        var pivot = _.default(rows).map(function (r) {
            var rdata = _.default(data).filter(function (d) {
                return row(d).id == r.id;
            });
            return (
                [r]
                    .concat(
                        _.default(columns)
                            .map(function (c) {
                                // console.log(c);
                                return aggr(
                                    _.default(rdata).filter(function (d) {
                                        return col(d).id == c.id;
                                    })
                                );
                            })
                            .value()
                    )
                    // the last two columns in each row
                    .concat([
                        _.chain(rdata)
                            .map(function (d) {
                                return parseInt(d.total);
                            })
                            .sum()
                            .value()
                    ])
            );
        });

        let footer = _.reduce(pivot.value(), (a, b) => {
            let list = ["Total"];
            for (let x = 1; x < a.length; x++) {
                list.push(b[x] + a[x]);
            }
            return list;
        });

        var array = [["Generos"].concat(columns).concat(["Total"])] // header row
            .concat(
                pivot
                    .orderBy(
                        i => {
                            // console.log(i)
                            return i[i.length - 1];
                        },
                        ["desc"]
                    )
                    .value()
            );
        array.push(footer);
        console.log(rows);
        console.log(columns);
        console.log(array);
    }
}