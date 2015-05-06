jQuery.widget("ui.itemPicker", jQuery.ui.widgetBase,
{
    options: {
        itemsSelector: null,
        itemsAttrId: null,
        messageBoxSelector: null,
        itemApllyingMsg: null,
        itemApllyingFailUnhandledMsg:'',
        itemServerPut: function (itemId) {
            return jQuery.ajax({
                url: "",
                type: "PUT",
                data: JSON.stringify({ itemId: itemId }),
                cache: false
            });
        },
        itemServerPutOk: function (result) {
            
        },
    },
    _create: function () {

        var self = this;

        this._super();

    },
    _init: function () {

        var self = this;

        this._super();

        jQuery(self.element)
            .find(self.options.itemsSelector)
                .click(function (e, ui) {
                    var itemSelected = jQuery(this).attr(self.options.itemsAttrId);
                    self.errorHide();
                    self.applyItem(itemSelected);
                })
            .end()
            .find(self.options.messageBoxSelector)
                .each(function () {
                    self.errorInit(jQuery(this));
                })
            .end();

    },
    destroy: function () {

        this._super();

    },
    applyItem: function (itemId) {

        var self = this;

        self._applyItem(itemId)
                .progress(function (status) {
                    self.progressShow(status);
                })
                .fail(function (args) {
                    self.progressHide();
                    self.errorDisplay(args);
                })
                .always(function () {
                    self.progressHide();
                });
    },
    _applyItem: function (itemId) {

        var self = this;
        var dfd = jQuery.Deferred();

        dfd.notify(self.options.itemApllyingMsg);

        jQuery.when(self.options.itemServerPut(itemId))
            .then(
                function (result, statusText, jqXHR) {
                    if (result.isValid) {
                        dfd.resolve();

                        self.options.itemServerPutOk(result);
                    }
                    else {
                        dfd.reject(result.messages[0]);
                    }
                },
                function (jqXHR, textStatus, errorThrown) {
                    dfd.reject(self.options.itemApllyingFailUnhandledMsg);
                })
            .done(function () {

            });

        return dfd.promise();
    }
});