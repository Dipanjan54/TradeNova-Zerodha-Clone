import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid, availableQty) => {},
  closeSellWindow: () => {},
  refreshData: () => {},
});

export const GeneralContextProvider = (props) => {
  // Buy state
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedBuyUID, setSelectedBuyUID] = useState("");

  // Sell state
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedSellUID, setSelectedSellUID] = useState("");
  const [selectedSellQty, setSelectedSellQty] = useState(0);

  // Data refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Open/Close Buy
  const handleOpenBuyWindow = (uid) => {
    console.log("handleOpenBuyWindow called with uid:", uid);
    setIsBuyWindowOpen(true);
    setSelectedBuyUID(uid);
  };

  const handleCloseBuyWindow = () => {
    console.log("handleCloseBuyWindow called");
    setIsBuyWindowOpen(false);
    setSelectedBuyUID("");
  };

  // Open/Close Sell
  const handleOpenSellWindow = (uid, availableQty) => {
    console.log("handleOpenSellWindow called with:", { uid, availableQty });
    setIsSellWindowOpen(true);
    setSelectedSellUID(uid);
    setSelectedSellQty(availableQty);
  };

  const handleCloseSellWindow = () => {
    console.log("handleCloseSellWindow called");
    setIsSellWindowOpen(false);
    setSelectedSellUID("");
    setSelectedSellQty(0);
  };

  // Refresh data function - triggers re-fetch in all components
  const handleRefreshData = () => {
    console.log("Refreshing all data...");
    setRefreshTrigger((prev) => prev + 1);
  };

  console.log("GeneralContext state:", {
    isBuyWindowOpen,
    isSellWindowOpen,
    selectedSellUID,
    selectedSellQty,
    refreshTrigger,
  });

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        refreshData: handleRefreshData,
        refreshTrigger, // Components can watch this value
      }}
    >
      {props.children}

      {isBuyWindowOpen && <BuyActionWindow uid={selectedBuyUID} />}
      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedSellUID}
          availableQty={selectedSellQty}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
