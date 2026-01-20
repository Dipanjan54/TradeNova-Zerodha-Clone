import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import GeneralContext from "./GeneralContext";
import API_URL from "../config";
import { axiosConfig } from "../utils/api";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { refreshTrigger } = useContext(GeneralContext);

  useEffect(() => {
    // Fetch holdings data
    const fetchHoldings = () => {
      setLoading(true);
      axios
        .get(`${API_URL}/allHoldings`, axiosConfig())
        .then((res) => {
          console.log("Holdings data fetched:", res.data);
          setAllHoldings(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching holdings:", error);
          setLoading(false);
        });
    };

    fetchHoldings();
  }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

  if (loading) {
    return <div>Loading holdings...</div>;
  }

  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      {allHoldings.length === 0 ? (
        <div className="no-holdings">
          <p>You don't have any holdings yet</p>
        </div>
      ) : (
        <>
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>Instrument</th>
                  <th>Qty.</th>
                  <th>Avg. cost</th>
                  <th>LTP</th>
                  <th>Cur. val</th>
                  <th>P&L</th>
                  <th>Net chg.</th>
                  <th>Day chg.</th>
                </tr>
              </thead>
              <tbody>
                {allHoldings.map((stock, index) => {
                  const curValue = stock.price * stock.qty;
                  const isProfit = curValue - stock.avg * stock.qty >= 0.0;
                  const profClass = isProfit ? "profit" : "loss";
                  const dayClass = stock.isLoss ? "loss" : "profit";

                  return (
                    <tr key={index}>
                      <td>{stock.name}</td>
                      <td>{stock.qty}</td>
                      <td>{stock.avg.toFixed(2)}</td>
                      <td>{stock.price.toFixed(2)}</td>
                      <td>{curValue.toFixed(2)}</td>
                      <td className={profClass}>
                        {(curValue - stock.avg * stock.qty).toFixed(2)}
                      </td>
                      <td className={profClass}>{stock.net}</td>
                      <td className={dayClass}>{stock.day}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="row">
            <div className="col">
              <VerticalGraph data={data} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Holdings;
