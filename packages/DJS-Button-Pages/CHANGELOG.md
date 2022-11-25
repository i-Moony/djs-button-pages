# ♻ Changelog:
All notable changes to this project will be documented here.

# 3.0.0 (2022-xx-xx)

## ♻ Refactor:
* **PaginationData & BasicPagination:** merge into `PaginationWrapper`.
* **PaginationData:** appeared as interface.
* **PaginationSent:** separate from the `PaginationWrapper`.
* **PaginationWrapper:** manages only data for pagination.
* **PaginationSent:** manages only a sent pagination. Data is immutable.
* **ButtonData:** rename to `ButtonWrapper` and merged with `CustomButton`.
* **ButtonStyling interface:** rename to `ButtonData`.
* **Pre-built buttons:** now belong to a separate package.
* **Constants:** use camelCase instead SNAKE_CASE.
* **Utils:** are moved to a separate files.
* **CollectorOptions:** merge with `FilterOptions`.
* **AfterSending type:** rename to `AfterSendingAction`.
* **OnStop type:** rename to `StopAction`.
* **ButtonDisableWhen type:** rename to `ButtonSwitch`.
* **ButtonAction & ButtonSwitch:** whole new API.
* **FilterOptions:** now allowedUsers are stored there.

## 🌌 Features:
* **PaginationSent:** now paginations are not updated automatically after button's action.
* **PaginationSent:** add update() method that updates message/interaction.
* **PaginationSent:** add delete() method that deletes message/interaction.
* **PaginationSent:** add setPage() method that sets page number.
* **PaginationSent:** add stop() method that stops pagination.
* **ButtonData:** remove disabled option.
* **PaginationWrapper:** remove insertEmbeds() and removeEmbeds() methods.
* **Promised type:** appear for values that are either promise or synchronous.
* **PaginationSend & PaginationWrapper:** add `BeforeStopAction`.
* **PaginationState:** appear to represent PaginationSent's state.
* **ButtonAction:** now receives interaction object.