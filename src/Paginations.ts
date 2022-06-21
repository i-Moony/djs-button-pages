/**
 * Copyright © 2022 Danila Kononov (nickname: moony). All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ChannelPagination from "./Classes/Paginations/ChannelPagination";
import MessageReplyPagination from "./Classes/Paginations/MessageReplyPagination";
import InteractionPagination from "./Classes/Paginations/InteractionPagination";
import CustomButton from "./Classes/Buttons/CustomButton";
import FirstPageButton from "./Classes/Buttons/FirstPageButton";
import LastPageButton from "./Classes/Buttons/LastPageButton";
import NextPageButton from "./Classes/Buttons/NextPageButton";
import PreviousPageButton from "./Classes/Buttons/PreviousPageButton";
import StopButton from "./Classes/Buttons/StopButton";
import BasePagination from "./Classes/Paginations/Abstract/BasePagination";
import PaginationData from "./Classes/Paginations/Abstract/PaginationData";
import ButtonData from "./Classes/Buttons/Abstract/ButtonData";

export { ChannelPagination,
    MessageReplyPagination,
    InteractionPagination,
    CustomButton,
    FirstPageButton,
    LastPageButton,
    NextPageButton,
    PreviousPageButton,
    StopButton,
    BasePagination,
    PaginationData,
    ButtonData };